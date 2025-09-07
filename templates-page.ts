import { prisma } from '@/lib/db'
import { TemplateGrid } from '@/components/templates/template-grid'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Template, Zap } from 'lucide-react'

async function getTemplates() {
  return await prisma.template.findMany({
    orderBy: [
      { industry: 'asc' },
      { kind: 'asc' },
      { name: 'asc' }
    ]
  })
}

export default async function TemplatesPage() {
  const templates = await getTemplates()

  const stats = {
    total: templates.length,
    photo: templates.filter(t => t.kind === 'PHOTO').length,
    video: templates.filter(t => t.kind === 'VIDEO').length,
    industries: new Set(templates.map(t => t.industry)).size
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Template Library
        </h1>
        <p className="text-gray-600">
          Choose from professionally designed templates optimized for different industries and use cases.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 template-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Template className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Templates</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 template-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.photo}</div>
              <div className="text-sm text-gray-600">Photo Templates</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 template-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.video}</div>
              <div className="text-sm text-gray-600">Video Templates</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 template-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Template className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.industries}</div>
              <div className="text-sm text-gray-600">Industries</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-gradient-to-r from-brand-50 to-purple-50 border-brand-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="h-5 w-5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              💡 How Templates Work
            </h3>
            <p className="text-gray-700 mb-3">
              Each template is designed for specific industries and includes optimized layouts, 
              color schemes, and field configurations. Simply choose a template, customize the 
              content, and generate your ad.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Industry-Specific</Badge>
              <Badge variant="secondary">Customizable Fields</Badge>
              <Badge variant="secondary">Optimized Layouts</Badge>
              <Badge variant="secondary">Professional Design</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      <TemplateGrid templates={templates} />
    </div>
  )
}