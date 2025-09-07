'use client'

import { useState } from 'react'
import { Asset, Template } from '@prisma/client'
import { AssetCard } from './asset-card'
import { AssetFilters } from './asset-filters'

type AssetWithTemplate = Asset & {
  template?: Pick<Template, 'name' | 'industry'> | null
}

interface AssetGridProps {
  assets: AssetWithTemplate[]
}

export function AssetGrid({ assets }: AssetGridProps) {
  const [filteredAssets, setFilteredAssets] = useState(assets)

  return (
    <div className="space-y-6">
      <AssetFilters 
        assets={assets} 
        onFilterChange={setFilteredAssets}
      />
      
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No assets match your filters
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}