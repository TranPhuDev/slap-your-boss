import { clamp } from '../../utils/math'
import { classifyFaceRegions } from './FaceRegionClassifier'
import { getOfficialFaceMeshTopology } from './faceMeshTopology'
import type { CropRect, FaceLandmark, FaceMeshData, MeshBuildOptions } from './types'

export function buildFaceMeshData(textureCanvas: HTMLCanvasElement, landmarks: FaceLandmark[], options: MeshBuildOptions): FaceMeshData {
  const uvs = buildUvs(landmarks, options)
  const vertices = buildVerticesFromUvs(uvs, options.displayWidth, options.displayHeight)
  const indices = filterTrianglesByUv(getOfficialFaceMeshTopology(landmarks.length), uvs)
  return {
    textureCanvas,
    vertices,
    restVertices: new Float32Array(vertices),
    velocities: new Float32Array(vertices.length),
    uvs,
    indices,
    regions: classifyFaceRegions(landmarks),
    width: options.displayWidth,
    height: options.displayHeight,
    offsetX: options.offsetX ?? 0,
    offsetY: options.offsetY ?? 0,
  }
}

export function buildUvs(landmarks: FaceLandmark[], options: Pick<MeshBuildOptions, 'sourceWidth' | 'sourceHeight' | 'crop'>): Float32Array {
  const uvs = new Float32Array(landmarks.length * 2)
  landmarks.forEach((landmark, index) => {
    const sourceX = landmark.x * options.sourceWidth
    const sourceY = landmark.y * options.sourceHeight
    uvs[index * 2] = clamp((sourceX - options.crop.x) / options.crop.width, 0, 1)
    uvs[index * 2 + 1] = clamp((sourceY - options.crop.y) / options.crop.height, 0, 1)
  })
  return uvs
}

export function buildVerticesFromUvs(uvs: Float32Array, displayWidth: number, displayHeight: number): Float32Array {
  const vertices = new Float32Array(uvs.length)
  for (let i = 0; i < uvs.length; i += 2) {
    vertices[i] = uvs[i] * displayWidth
    vertices[i + 1] = uvs[i + 1] * displayHeight
  }
  return vertices
}

export function cropRectFromLandmarks(
  landmarks: FaceLandmark[],
  sourceWidth: number,
  sourceHeight: number,
  paddingX: number,
  paddingY: number,
): CropRect {
  const xs = landmarks.map((landmark) => landmark.x * sourceWidth)
  const ys = landmarks.map((landmark) => landmark.y * sourceHeight)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = maxX - minX
  const height = maxY - minY
  const x = clamp(minX - width * paddingX, 0, sourceWidth - 1)
  const y = clamp(minY - height * paddingY, 0, sourceHeight - 1)
  const right = clamp(maxX + width * paddingX, x + 1, sourceWidth)
  const bottom = clamp(maxY + height * paddingY, y + 1, sourceHeight)
  return { x, y, width: right - x, height: bottom - y }
}

export function cropRectFromLandmarksDirectional(
  landmarks: FaceLandmark[],
  sourceWidth: number,
  sourceHeight: number,
  padding: { left: number; right: number; top: number; bottom: number },
): CropRect {
  const xs = landmarks.map((landmark) => landmark.x * sourceWidth)
  const ys = landmarks.map((landmark) => landmark.y * sourceHeight)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = maxX - minX
  const height = maxY - minY
  const x = clamp(minX - width * padding.left, 0, sourceWidth - 1)
  const y = clamp(minY - height * padding.top, 0, sourceHeight - 1)
  const right = clamp(maxX + width * padding.right, x + 1, sourceWidth)
  const bottom = clamp(maxY + height * padding.bottom, y + 1, sourceHeight)
  return { x, y, width: right - x, height: bottom - y }
}

export function drawCropToCanvas(source: HTMLCanvasElement, crop: CropRect, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable in this browser.')
  ctx.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, width, height)
  return canvas
}

export function drawSoftMaskedHeadCropToCanvas(source: HTMLCanvasElement, crop: CropRect, width: number, height: number): HTMLCanvasElement {
  return drawMaskedHeadCropToCanvas(source, crop, width, height, {
    centerY: 0.52,
    innerRadius: 0.28,
    outerRadius: 0.64,
    solidStop: 0.84,
    radiusX: 0.49,
    radiusY: 0.58,
  })
}

export function drawIsolatedHeadCropToCanvas(source: HTMLCanvasElement, crop: CropRect, width: number, height: number): HTMLCanvasElement {
  const canvas = drawCropToCanvas(source, crop, width, height)
  // removeBackgroundFromBorder(canvas)
  applyHeadAlphaMask(canvas, {
    centerY: 0.52,
    innerRadius: 0.24,
    outerRadius: 0.54,
    solidStop: 0.72,
    radiusX: 0.43,
    radiusY: 0.51,
  })
  return canvas
}

function drawMaskedHeadCropToCanvas(
  source: HTMLCanvasElement,
  crop: CropRect,
  width: number,
  height: number,
  maskConfig: { centerY: number; innerRadius: number; outerRadius: number; solidStop: number; radiusX: number; radiusY: number },
): HTMLCanvasElement {
  const canvas = drawCropToCanvas(source, crop, width, height)
  applyHeadAlphaMask(canvas, maskConfig)
  return canvas
}

function applyHeadAlphaMask(
  canvas: HTMLCanvasElement,
  maskConfig: { centerY: number; innerRadius: number; outerRadius: number; solidStop: number; radiusX: number; radiusY: number },
): void {
  const width = canvas.width
  const height = canvas.height
  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = width
  maskCanvas.height = height
  const maskCtx = maskCanvas.getContext('2d')
  const ctx = canvas.getContext('2d')
  if (!maskCtx || !ctx) throw new Error('Canvas is unavailable in this browser.')

  const gradient = maskCtx.createRadialGradient(
    width * 0.5,
    height * maskConfig.centerY,
    height * maskConfig.innerRadius,
    width * 0.5,
    height * maskConfig.centerY,
    height * maskConfig.outerRadius,
  )
  gradient.addColorStop(0, 'rgba(0,0,0,1)')
  gradient.addColorStop(maskConfig.solidStop, 'rgba(0,0,0,1)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  maskCtx.fillStyle = gradient
  maskCtx.beginPath()
  maskCtx.ellipse(width * 0.5, height * maskConfig.centerY, width * maskConfig.radiusX, height * maskConfig.radiusY, 0, 0, Math.PI * 2)
  maskCtx.fill()

  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(maskCanvas, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  maskCanvas.width = 0
  maskCanvas.height = 0
}

export function removeBackgroundFromBorder(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable in this browser.')
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const background = sampleBorderColor(image.data, canvas.width, canvas.height)
  const cx = canvas.width * 0.5
  const cy = canvas.height * 0.52
  const protectRx = canvas.width * 0.27
  const protectRy = canvas.height * 0.33
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const i = (y * canvas.width + x) * 4
      const normalized = (x - cx) ** 2 / protectRx ** 2 + (y - cy) ** 2 / protectRy ** 2
      if (normalized < 0.9) continue
      const distance = colorDistance(image.data[i], image.data[i + 1], image.data[i + 2], background.r, background.g, background.b)
      const edgeBias = Math.min(x, y, canvas.width - 1 - x, canvas.height - 1 - y) / Math.min(canvas.width, canvas.height)
      const transparentThreshold = 44 + Math.max(0, 0.12 - edgeBias) * 180
      const opaqueThreshold = transparentThreshold + 54
      if (distance <= transparentThreshold) {
        image.data[i + 3] = 0
      } else if (distance < opaqueThreshold) {
        const alphaScale = (distance - transparentThreshold) / (opaqueThreshold - transparentThreshold)
        image.data[i + 3] = Math.round(image.data[i + 3] * alphaScale)
      }
    }
  }
  ctx.putImageData(image, 0, 0)
}

function sampleBorderColor(data: Uint8ClampedArray, width: number, height: number): { r: number; g: number; b: number } {
  let r = 0
  let g = 0
  let b = 0
  let count = 0
  const step = Math.max(1, Math.floor(Math.min(width, height) / 32))
  const add = (x: number, y: number) => {
    const i = (y * width + x) * 4
    if (data[i + 3] < 200) return
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
    count += 1
  }
  for (let x = 0; x < width; x += step) {
    add(x, 0)
    add(x, height - 1)
  }
  for (let y = 0; y < height; y += step) {
    add(0, y)
    add(width - 1, y)
  }
  return count > 0 ? { r: r / count, g: g / count, b: b / count } : { r: 255, g: 255, b: 255 }
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2)
}

export function drawBackHeadCanvasWithFaceCutout(
  source: HTMLCanvasElement,
  headCrop: CropRect,
  faceCrop: CropRect,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = drawSoftMaskedHeadCropToCanvas(source, headCrop, width, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable in this browser.')
  const faceFrame = faceCropFrameInHeadDisplay(headCrop, faceCrop, width, height)
  ctx.save()
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.ellipse(
    faceFrame.x + faceFrame.width / 2,
    faceFrame.y + faceFrame.height / 2,
    faceFrame.width * 0.55,
    faceFrame.height * 0.58,
    0,
    0,
    Math.PI * 2,
  )
  ctx.fillStyle = 'rgba(0,0,0,0.98)'
  ctx.fill()
  ctx.restore()
  return canvas
}

export function faceCropFrameInHeadDisplay(headCrop: CropRect, faceCrop: CropRect, displayWidth: number, displayHeight: number): CropRect {
  return {
    x: ((faceCrop.x - headCrop.x) / headCrop.width) * displayWidth,
    y: ((faceCrop.y - headCrop.y) / headCrop.height) * displayHeight,
    width: (faceCrop.width / headCrop.width) * displayWidth,
    height: (faceCrop.height / headCrop.height) * displayHeight,
  }
}

function filterTrianglesByUv(indices: Uint32Array, uvs: Float32Array): Uint32Array {
  const filtered: number[] = []
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i]
    const b = indices[i + 1]
    const c = indices[i + 2]
    if (uvValid(a, uvs) && uvValid(b, uvs) && uvValid(c, uvs)) filtered.push(a, b, c)
  }
  return new Uint32Array(filtered)
}

function uvValid(index: number, uvs: Float32Array): boolean {
  const u = uvs[index * 2]
  const v = uvs[index * 2 + 1]
  return u >= 0 && u <= 1 && v >= 0 && v <= 1
}
