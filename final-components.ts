// src/components/library/asset-filters.tsx
'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter } from 'lucide-react'

interface Asset {
  id: string
  type: 'PHOTO' | 'VIDEO'
  status: 'READY' | 'PROCESSING' | 'FAILED'
  aspect: 'SQUARE' | 'VERTICAL' | 'WIDESCREEN'
  title: string
  createdAt: Date
  template?: { name: string; industry: string } | null
}

interface AssetFiltersProps {
  assets: Asset[]
  onFilterChange: (filtered: Asset[]) => void
}

export function AssetFilters({ assets, onFilterChange }: AssetFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedAspect, setSelectedAspect] = useState<string>('all')

  useEffect(() => {
    const filtered = assets.filter(asset => {
      const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || asset.type === selectedType
      const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus
      const matchesAspect = selectedAspect === 'all' || asset.aspect === selectedAspect

      return matchesSearch && matchesType && matchesStatus && matchesAspect
    })

    onFilterChange(filtered)
  }, [searchTerm, selectedType, selectedStatus, selectedAspect, assets, onFilterChange])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedStatus('all')
    setSelectedAspect('all')
  }

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'all' || 
                          selectedStatus !== 'all' || selectedAspect !== 'all'

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search assets..."
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

        {/* Type Filter */}
        <div className="flex gap-1">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            All Types
          </Button>
          <Button
            variant={selectedType === 'PHOTO' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('PHOTO')}
          >
            Photos
          </Button>
          <Button
            variant={selectedType === 'VIDEO' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('VIDEO')}
          >
            Videos
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-1">
          <Button
            variant={selectedStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('all')}
          >
            All Status
          </Button>
          <Button
            variant={selectedStatus === 'READY' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('READY')}
          >
            Ready
          </Button>
          <Button
            variant={selectedStatus === 'PROCESSING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStatus('PROCESSING')}
          >
            Processing
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Active:</span>
          {selectedType !== 'all' && <Badge variant="secondary">{selectedType}</Badge>}
          {selectedStatus !== 'all' && <Badge variant="secondary">{selectedStatus}</Badge>}
          {selectedAspect !== 'all' && <Badge variant="secondary">{selectedAspect}</Badge>}
        </div>
      )}
    </div>
  )
}

// src/components/library/asset-card.tsx
'use client'

import { Asset, Template } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image, Video, Download, Copy, MoreHorizontal } from 'lucide-react'
import { getStatusColor, formatRelativeTime, downloadFile } from '@/lib/utils'

type AssetWithTemplate = Asset & {
  template?: Pick<Template, 'name' | 'industry'> | null
}

interface AssetCardProps {
  asset: AssetWithTemplate
}

export function AssetCard({ asset }: AssetCardProps) {
  const handleDownload = () => {
    downloadFile(asset.url, `${asset.title}.${asset.type === 'PHOTO' ? 'png' : 'mp4'}`)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}${asset.url}`)
  }

  return (
    <Card className="asset-card overflow-hidden">
      {/* Preview */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {asset.status === 'READY' && (asset.thumbUrl || asset.url) ? (
          <img
            src={asset.thumbUrl || asset.url}
            alt={asset.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            {asset.type === 'PHOTO' ? (
              <Image className="h-8 w-8 text-gray-400" />
            ) : (
              <Video className="h-8 w-8 text-gray-400" />
            )}
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-2 left-2">
          <Badge className={getStatusColor(asset.status)}>
            {asset.status.toLowerCase()}
          </Badge>
        </div>

        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/80">
            {asset.type === 'PHOTO' ? '1' : '5'} token{asset.type === 'VIDEO' ? 's' : ''}
          </Badge>
        </div>

        {/* Type indicator */}
        <div className="absolute bottom-2 left-2">
          {asset.type === 'PHOTO' ? (
            <Image className="h-4 w-4 text-white" />
          ) : (
            <Video className="h-4 w-4 text-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-gray-900 truncate" title={asset.title}>
            {asset.title}
          </h3>
          <p className="text-xs text-gray-500">
            {asset.template?.name || 'Custom'} • {formatRelativeTime(asset.createdAt)}
          </p>
        </div>

        {/* Actions */}
        {asset.status === 'READY' && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyUrl}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

// src/components/ui/toaster.tsx
'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  )
}

// src/types/next-auth.d.ts
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      tokens: number
    }
  }

  interface User {
    role: string
    tokens: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    tokens: number
  }
}