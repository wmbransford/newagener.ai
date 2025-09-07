'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Failed to send sign-in link')
      } else {
        setEmailSent(true)
        toast.success('Check your email for a sign-in link!')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/app' })
    } catch (error) {
      toast.error('Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <Card className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Check your email
        </h3>
        <p className="text-gray-600 mb-4">
          We've sent a sign-in link to <strong>{email}</strong>
        </p>
        <Button
          variant="outline"
          onClick={() => setEmailSent(false)}
          className="w-full"
        >
          Use a different email
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Google Sign In */}
      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        variant="outline"
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Email Sign In */}
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="mt-1"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending link...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send sign-in link
            </>
          )}
        </Button>
      </form>

      {/* Benefits */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 text-center mb-3">
          ✨ New users get 10 free tokens to start creating
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="text-center">
            <div className="font-medium">1 Token</div>
            <div>Photo Ads</div>
          </div>
          <div className="text-center">
            <div className="font-medium">5 Tokens</div>
            <div>Video Ads</div>
          </div>
        </div>
      </div>
    </Card>
  )
}