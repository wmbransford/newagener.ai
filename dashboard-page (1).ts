import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Image,
  Video,
  Template,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'

async function getDashboardData(userId: string) {
  const [assets, recentAssets, templates] = await Promise.all([
    prisma.asset.findMany({
      where: { userId },
      select: {
        type: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.asset.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        template: {
          select: { name: true }
        }
      }
    }),
    prisma.template.count()
  ])

  const stats = {
    totalAssets: assets.length,
    photoAds: assets.filter(a => a.type === 'PHOTO').length,
    videoAds: assets.filter(a => a.type === 'VIDEO').length,
    thisWeek: assets.filter(a => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return a.createdAt > weekAgo
    }).length,
    templates
  }

  return { stats, recentAssets }
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  const { stats, recentAssets } = await getDashboardData(session!.user!.id)

  const quickActions = [
    {
      title: "Create Photo Ad",
      description: "Generate stunning photo advertisements",
      icon: Image,
      href: "/app/generate/photo",
      cost: "1 token",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      title: "Create Video Ad", 
      description: "Generate engaging video content",
      icon: Video,
      href: "/app/generate/video",
      cost: "5 tokens",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      title: "Browse Templates",
      description: "Explore industry-specific templates",
      icon: Template,
      href: "/app/templates",
      cost: "Free",
      color: "bg-green-50 text-green-600 border-green-200"
    }
  ]

  const statCards = [
    {
      title: "Total Assets",
      value: stats.totalAssets,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Photo Ads",
      value: stats.photoAds,
      icon: Image,
      color: "text-green-600"
    },
    {
      title: "Video Ads", 
      value: stats.videoAds,
      icon: Video,
      color: "text-purple-600"
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: Clock,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Creator'}!
        </h1>
        <p className="text-gray-600">
          Ready to create amazing ads? You have {session?.user?.tokens || 0} tokens available.
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="template-card p-6 hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {action.cost}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="p-6 template-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Assets */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Assets</h2>
          <Link href="/app/library">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        
        {recentAssets.length > 0 ? (
          <div className="space-y-3">
            {recentAssets.map((asset) => (
              <Card key={asset.id} className="p-4 asset-card">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {asset.type === 'PHOTO' ? (
                      <Image className="h-6 w-6 text-gray-600" />
                    ) : (
                      <Video className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {asset.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {asset.template?.name || 'Custom'} • {asset.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      asset.status === 'READY' 
                        ? 'status-ready' 
                        : asset.status === 'PROCESSING' 
                        ? 'status-processing' 
                        : 'status-failed'
                    }`}>
                      {asset.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assets yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start creating your first ad to see it here.
            </p>
            <Link href="/app/generate/photo">
              <Button className="btn-primary">
                Create Your First Ad
              </Button>
            </Link>
          </Card>
        )}
      </section>

      {/* Tips Section */}
      <section>
        <Card className="p-6 bg-gradient-to-r from-brand-50 to-purple-50 border-brand-200">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                💡 Pro Tip
              </h3>
              <p className="text-gray-700 mb-3">
                Start with our industry templates to get better results faster. Each template 
                is optimized for specific business types and includes proven layouts.
              </p>
              <Link href="/app/templates">
                <Button size="sm" className="btn-primary">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}