'use client'

import { useState, useTransition } from 'react'
import { Template } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { generatePhoto } from '@/actions/generate-photo'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Image, Zap } from 'lucide-react'
import { PreviewCanvas } from './preview-canvas'

interface PhotoGeneratorProps {
  template?: Template | null
}

export function PhotoGenerator({ template }: PhotoGeneratorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Form state
  const [formData, setFormData] = useState({
    title: template?.name ? `${template.name} Ad` : '',
    prompt: template?.description || '',
    aspect: (template?.aspect as 'SQUARE' | 'VERTICAL' | 'WIDESCREEN') || 'SQUARE',
    templateConfig: {
      headline: '',
      subheadline: '',
      price: '',
      cta: '',
      description: '',
      ...(template?.fields as any || {})
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.prompt) {
      toast.error('Please fill in all required fields')
      return
    }

    startTransition(async () => {
      const form = new FormData()
      form.append('templateId', template?.id || '')
      form.append('title', formData.title)
      form.append('prompt', formData.prompt)
      form.append('aspect', formData.aspect)
      form.append('templateConfig', JSON.stringify(formData.templateConfig))

      const result = await generatePhoto(form)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Photo generated successfully!')
        router.push('/app/library')
      }
    })
  }

  const updateTemplateConfig = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      templateConfig: {
        ...prev.templateConfig,
        [key]: value
      }
    }))
  }

  const aspectOptions = [
    { value: 'SQUARE', label: '1:1 Square', description: 'Perfect for Instagram posts' },
    { value: 'VERTICAL', label: '9:16 Vertical', description: 'Instagram Stories, TikTok' },
    { value: 'WIDESCREEN', label: '16:9 Widescreen', description: 'Facebook, LinkedIn' }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Info */}
            {template && (
              <div className="p-4 bg-brand-50 rounded-lg border border-brand-200">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-brand-600" />
                  <div>
                    <h3 className="font-medium text-brand-900">{template.name}</h3>
                    <p className="text-sm text-brand-700">{template.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Ad Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a title for your ad"
                  required
                />
              </div>

              <div>
                <Label htmlFor="prompt">Description / Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe what you want to create..."
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <Label>Aspect Ratio</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {aspectOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.aspect === option.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="aspect"
                      value={option.value}
                      checked={formData.aspect === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, aspect: e.target.value as any }))}
                      className="text-brand-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Template Fields */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label className="text-base font-medium">Content Fields</Label>
                <Badge variant="secondary">Customize your ad</Badge>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={formData.templateConfig.headline || ''}
                    onChange={(e) => updateTemplateConfig('headline', e.target.value)}
                    placeholder="Main headline text"
                  />
                </div>

                <div>
                  <Label htmlFor="subheadline">Subheadline</Label>
                  <Input
                    id="subheadline"
                    value={formData.templateConfig.subheadline || ''}
                    onChange={(e) => updateTemplateConfig('subheadline', e.target.value)}
                    placeholder="Supporting text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.templateConfig.price || ''}
                      onChange={(e) => updateTemplateConfig('price', e.target.value)}
                      placeholder="$99.99"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cta">Call to Action</Label>
                    <Input
                      id="cta"
                      value={formData.templateConfig.cta || ''}
                      onChange={(e) => updateTemplateConfig('cta', e.target.value)}
                      placeholder="Shop Now"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full btn-primary"
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Photo (1 Token)
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Preview */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <PreviewCanvas
            type="PHOTO"
            aspect={formData.aspect}
            templateConfig={formData.templateConfig}
            template={template}
          />
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h4 className="font-medium text-gray-900 mb-2">💡 Tips for Better Results</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Be specific in your description</li>
            <li>• Include brand colors or style preferences</li>
            <li>• Mention the target audience</li>
            <li>• Keep text concise and impactful</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}