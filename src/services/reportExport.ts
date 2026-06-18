import type { FaceAsset, GameResult } from '../types/game'

export async function exportReportPng(result: GameResult, face: FaceAsset | null): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas export is unavailable.')
  ctx.fillStyle = '#fff4d6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#121212'
  ctx.font = '900 86px system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('SLAP REPORT', 540, 130)
  drawCharacter(ctx, face ? await loadImage(face.objectUrl) : null)
  ctx.fillStyle = '#121212'
  ctx.font = '700 46px system-ui'
  const rows = [
    `Boss: ${result.bossName}`,
    `Total Slaps: ${result.totalSlaps}`,
    `Max Combo: ${result.maxCombo}`,
    `Face Damage: ${result.faceDamage}%`,
    `Stress Released: ${result.stressReleased}%`,
    `Best Slap: ${result.bestSlap}`,
    `Final Score: ${result.finalScore}`,
  ]
  rows.forEach((row, index) => ctx.fillText(row, 540, 760 + index * 60))
  ctx.fillStyle = '#d52924'
  ctx.font = '900 66px system-ui'
  ctx.fillText(result.rank.toUpperCase(), 540, 1230)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('PNG export failed.'))
    }, 'image/png')
  })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load report image.'))
    image.src = src
  })
}

function drawCharacter(ctx: CanvasRenderingContext2D, face: HTMLImageElement | null) {
  ctx.save()
  ctx.translate(540, 410)
  ctx.fillStyle = '#1f2937'
  ctx.beginPath()
  ctx.roundRect(-210, 120, 420, 300, 45)
  ctx.fill()
  ctx.fillStyle = '#f8fafc'
  ctx.beginPath()
  ctx.moveTo(-70, 120)
  ctx.lineTo(0, 260)
  ctx.lineTo(70, 120)
  ctx.fill()
  ctx.fillStyle = '#d52924'
  ctx.beginPath()
  ctx.moveTo(0, 135)
  ctx.lineTo(35, 310)
  ctx.lineTo(0, 375)
  ctx.lineTo(-35, 310)
  ctx.fill()
  ctx.fillStyle = '#f2c18d'
  ctx.beginPath()
  ctx.ellipse(0, 0, 165, 190, 0, 0, Math.PI * 2)
  ctx.fill()
  if (face) ctx.drawImage(face, -135, -155, 270, 330)
  ctx.restore()
}
