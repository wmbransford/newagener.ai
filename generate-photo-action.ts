'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiService } from '@/lib/ai'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const generatePhotoSchema = z.object({
  templateId: z.string().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  aspect: z.enum(['SQUARE', 'VERTICAL', 'WIDESCREEN']),
  templateConfig: z.object({
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    price: z.string().optional(),
    cta: z.string().optional(),
    description: z.string().optional(),
  }),
  title: z.string().min(1, 'Title is required'),
})

export async function generatePhoto(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return { error: 'Not authenticated' }
    }

    // Parse form data
    const data = {
      templateId: formData.get('templateId') as string || undefined,
      prompt: formData.get('prompt') as string,
      aspect: formData.get('aspect') as 'SQUARE' | 'VERTICAL' | 'WIDESCREEN',
      templateConfig: JSON.parse(formData.get('templateConfig') as string || '{}'),
      title: formData.get('title') as string,
    }

    // Validate input
    const validatedData = generatePhotoSchema.parse(data)

    const PHOTO_COST = 1
    const userId = session.user.id

    // Check token balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tokens: true }
    })

    if (!user || user.tokens < PHOTO_COST) {
      return { error: 'Insufficient tokens' }
    }

    // Deduct tokens first (refund on failure)
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { tokens: { decrement: PHOTO_COST } }
      })

      await tx.tokenTransaction.create({
        data: {
          userId,
          delta: -PHOTO_COST,
          reason: 'generation',
          ref: 'pending'
        }
      })
    })

    try {
      // Get user's brand settings
      const userWithBrand = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          brandName: true,
          brandColors: true,
          brandLogo: true
        }
      })

      // Determine dimensions
      let width = 1080, height = 1080
      if (validatedData.aspect === 'VERTICAL') {
        width = 1080
        height = 1920
      } else if (validatedData.aspect === 'WIDESCREEN') {
        width = 1920
        height = 1080
      }

      // Create asset record
      const asset = await prisma.asset.create({
        data: {
          userId,
          templateId: validatedData.templateId || null,
          type: 'PHOTO',
          title: validatedData.title,
          prompt: validatedData.prompt,
          width,
          height,
          aspect: validatedData.aspect,
          costTokens: PHOTO_COST,
          status: 'PROCESSING',
          url: '', // Will be updated after generation
          meta: {
            templateConfig: validatedData.templateConfig,
            brand: userWithBrand
          }
        }
      })

      // Generate image
      const result = await aiService.generateImage({
        prompt: validatedData.prompt,
        width,
        height,
        aspect: validatedData.aspect,
        templateConfig: validatedData.templateConfig,
        brand: {
          name: userWithBrand?.brandName || undefined,
          colors: userWithBrand?.brandColors as any || undefined,
          logo: userWithBrand?.brandLogo || undefined
        }
      })

      // Update asset with result
      await prisma.asset.update({
        where: { id: asset.id },
        data: {
          url: result.url,
          thumbUrl: result.thumbUrl,
          status: 'READY'
        }
      })

      // Update transaction reference
      await prisma.tokenTransaction.updateMany({
        where: {
          userId,
          ref: 'pending',
          reason: 'generation'
        },
        data: {
          ref: asset.id
        }
      })

      revalidatePath('/app/library')
      revalidatePath('/app')

      return { success: true, assetId: asset.id }

    } catch (error) {
      console.error('Generation failed:', error)

      // Refund tokens
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { tokens: { increment: PHOTO_COST } }
        })

        await tx.tokenTransaction.create({
          data: {
            userId,
            delta: PHOTO_COST,
            reason: 'refund',
            ref: 'generation_failed'
          }
        })
      })

      return { error: 'Generation failed. Tokens have been refunded.' }
    }

  } catch (error) {
    console.error('Photo generation error:', error)
    
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input data' }
    }
    
    return { error: 'An unexpected error occurred' }
  }
}