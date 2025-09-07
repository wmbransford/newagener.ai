import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { Logo } from '@/components/brand/logo'
import Link from 'next/link'

export default async function SignInPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Logo className="h-12 w-12" />
            <span className="text-2xl font-bold text-gray-900">adgener.ai</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to start creating amazing ads
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            New to adgener.ai?{' '}
            <Link href="/" className="font-medium text-brand-600 hover:text-brand-500">
              Get started with 10 free tokens
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}