export function addWatermarkToCanvas(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
) {
  ctx.save()
  ctx.font = '14px Segoe UI, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(29, 20, 72, 0.4)'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText('ausmalbilder-gratis.com', canvasWidth - 12, canvasHeight - 12)
  ctx.restore()
}

export type ExportFormat = 'default' | 'pinterest' | 'instagram' | 'whatsapp'

export const exportDimensions: Record<ExportFormat, { width: number; height: number }> = {
  default: { width: 2480, height: 3508 },
  pinterest: { width: 1000, height: 1500 },
  instagram: { width: 1080, height: 1920 },
  whatsapp: { width: 1080, height: 1080 },
}
