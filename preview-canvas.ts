'use client'

import { Template } from '@prisma/client'
import { getAspectRatioClass } from '@/lib/utils'
import { Image, Video } from 'lucide-react'

interface PreviewCanvasProps {
  type: 'PHOTO' | 'VIDEO'
  aspect: 'SQUARE' | 'VERTICAL' | 'WIDESCREEN'
  templateConfig: any
  template?: Template | null
}

export function PreviewCanvas({ type, aspect, templateConfig, template }: PreviewCanvasProps) {
  const aspectClass = getAspectRatioClass(aspect)
  
  // Mock preview based on template configuration
  const renderPreview = () => {
    const hasContent = templateConfig.headline || templateConfig.subheadline || templateConfig.price || templateConfig.cta

    if (!hasContent) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
          {type === 'PHOTO' ? (
            <Image className="h-12 w-12 mb-2" />
          ) : (
            <Video className="h-12 w-12 mb-2" />
          )}
          <p className="text-sm">Preview will appear here</p>
          <p className="text-xs">Fill in the form to see a preview</p>
        </div>
      )
    }

    // Simple preview layout
    return (
      <div 
        className="w-full h-full relative overflow-hidden rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Brand logo placeholder */}
        <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
          L
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
          {templateConfig.headline && (
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 text-shadow">
              {templateConfig.headline}
            </h1>
          )}
          
          {templateConfig.subheadline && (
            <p className="text-sm md:text-base opacity-90 mb-3">
              {templateConfig.subheadline}
            </p>
          )}
          
          {templateConfig.price && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-3">
              <span className="text-lg md:text-xl font-bold">
                {templateConfig.price}
              </span>
            </div>
          )}
          
          {templateConfig.cta && (
            <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold text-sm md:text-base shadow-lg">
              {templateConfig.cta}
            </button>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
        
        {type === 'VIDEO' && (
          <div className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2">
            <Video className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Aspect ratio info */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Preview ({aspect === 'SQUARE' ? '1:1' : aspect === 'VERTICAL' ? '9:16' : '16:9'})</span>
        {template && (
          <span className="text-brand-600">Using {template.name}</span>
        )}
      </div>

      {/* Preview container */}
      <div className="w-full max-w-sm mx-auto">
        <div className={`${aspectClass} bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden shadow-lg`}>
          {renderPreview()}
        </div>
      </div>

      {/* Preview note */}
      <p className="text-xs text-gray-500 text-center">
        This is a simplified preview. The actual generated ad will be higher quality and may look different.
      </p>
    </div>
  )
}