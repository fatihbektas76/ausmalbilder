'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ColoringImage } from '@/data/types'

const ColoringTool = dynamic(() => import('@/components/coloring/ColoringTool'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
      <p className="text-gray-400">Ausmaltool wird geladen...</p>
    </div>
  ),
})

const ShareModal = dynamic(() => import('@/components/coloring/ShareModal'), {
  ssr: false,
})

export default function ColoringToolWrapper({ image }: { image: ColoringImage }) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareImageData, setShareImageData] = useState<string | null>(null)

  const handleShare = (imageDataUrl: string) => {
    setShareImageData(imageDataUrl)
    setShowShareModal(true)
  }

  return (
    <div id="coloring-tool">
      <ColoringTool
        imageSrc={image.svgUrl || image.imageUrl}
        imageTitle={image.title}
        imageSlug={image.slug}
        onShare={handleShare}
      />

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          imageDataUrl={shareImageData}
          imageTitle={image.title}
          imageSlug={image.slug}
          category={image.category}
        />
      )}
    </div>
  )
}
