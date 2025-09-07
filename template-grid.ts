'use client'

import { useState } from 'react'
import { Template } from '@prisma/client'
import { TemplateCard } from './template-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getIndustryLabel } from '@/lib/utils'
import { Search, Filter } from 'lucide-react'

interface TemplateGridProps {
  templates: Template[]
}

export function TemplateGrid({ templates }: TemplateGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedAspect, setSelectedAspect] = useState<string>('all')

  // Get unique values for filters
  const industries = Array.from(new Set(templates.map(t => t.industry)))
  const types = Array.from(new Set(templates.map(t => t.kind)))
  const aspects = Array.from(new Set(templates.map(t => t.aspect)))

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry
    const matchesType = selectedType === 'all' || template.kind === selectedType
    const matchesAspect = selectedAspect === 'all' || template.aspect === selectedAspect

    return matchesSearch && matchesIndustry && matchesType && matchesAspect
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedIndustry('all')
    setSelectedType('all')
    setSelectedAspect('all')
  }

  const hasActiveFilters = searchTerm !== '' || selectedIndustry !== 'all' || 
                          selectedType !== 'all' || selectedAspect !== 'all'

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Industry Filter */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedIndustry === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedIndustry('all')}
            >
              All Industries
            </Button>
            {industries.map(industry => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedIndustry(industry)}
              >
                {getIndustryLabel(industry)}
              </Button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Types
            </Button>
            {types.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type === 'PHOTO' ? 'Photo' : 'Video'}
              </Button>
            ))}
          </div>

          {/* Aspect Filter */}
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedAspect === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAspect('all')}
            >
              All Ratios
            </Button>
            {aspects.map(aspect => (
              <Button
                key={aspect}
                variant={selectedAspect === aspect ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAspect(aspect)}
              >
                {aspect === 'SQUARE' ? '1:1' : aspect === 'VERTICAL' ? '9:16' : '16:9'}
              </Button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredTemplates.length} of {templates.length} templates
        </p>
        
        {hasActiveFilters && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {selectedIndustry !== 'all' && (
              <Badge variant="secondary">{getIndustryLabel(selectedIndustry)}</Badge>
            )}
            {selectedType !== 'all' && (
              <Badge variant="secondary">{selectedType}</Badge>
            )}
            {selectedAspect !== 'all' && (
              <Badge variant="secondary">{selectedAspect}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}