import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Zap, 
  Image, 
  Video, 
  Palette, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Logo } from '@/components/brand/logo'

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description: "Create professional ads in seconds using advanced AI technology"
  },
  {
    icon: Image,
    title: "Photo Ads",
    description: "Generate stunning photo advertisements for just 1 token each"
  },
  {
    icon: Video,
    title: "Video Ads", 
    description: "Create engaging video content for 5 tokens with multiple durations"
  },
  {
    icon: Palette,
    title: "Industry Templates",
    description: "Choose from templates for restaurants, gyms, real estate, and more"
  },
  {
    icon: Clock,
    title: "Lightning Fast",
    description: "Get your ads ready in under 30 seconds with our optimized pipeline"
  },
  {
    icon: Star,
    title: "Professional Quality",
    description: "High-resolution outputs ready for all major social media platforms"
  }
]

const pricing = [
  {
    name: "Starter",
    tokens: 20,
    price: 10,
    description: "Perfect for small businesses and individuals",
    popular: false
  },
  {
    name: "Growth", 
    tokens: 60,
    price: 25,
    description: "Great for growing businesses and marketing teams",
    popular: true
  },
  {
    name: "Pro",
    tokens: 150, 
    price: 50,
    description: "Ideal for agencies and high-volume users",
    popular: false
  }
]

export default async function LandingPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Logo className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900">adgener.ai</span>
            </div>
            <Link href="/app">
              <Button size="lg" className="btn-primary">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Stunning
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              {" "}AI-Powered Ads
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Generate professional photo and video advertisements in seconds using our 
            AI-powered platform with industry-specific templates. No design skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/app">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              ✨ Start with 10 free tokens • No credit card required
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600">1 Token</div>
              <div className="text-gray-600">Photo Ads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600">5 Tokens</div>
              <div className="text-gray-600">Video Ads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-600">8+ Industries</div>
              <div className="text-gray-600">Template Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create Amazing Ads
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create professional advertisements 
              without any design experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 template-card hover:scale-105 transition-transform duration-200">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Pay only for what you use with our token-based system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card key={index} className={`p-8 template-card relative ${plan.popular ? 'ring-2 ring-brand-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                  </div>
                  <div className="text-gray-600 mb-4">{plan.tokens} tokens</div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">{Math.floor(plan.tokens / 1)} photo ads</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">{Math.floor(plan.tokens / 5)} video ads</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">All templates included</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-600">High-resolution downloads</span>
                    </div>
                  </div>
                  
                  <Link href="/app">
                    <Button 
                      className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses creating professional ads with AI. 
            Start with 10 free tokens and see the difference quality makes.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-50 text-lg px-8 py-4">
              Start Creating Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Logo className="h-8 w-auto text-white" />
              <span className="text-xl font-bold text-white">adgener.ai</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 adgener.ai. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}