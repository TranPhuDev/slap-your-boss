import type { FaceAsset, FaceLandmark, FaceMeshData, FaceRegion } from '../types/game'

export function shouldUseRealHeadVisualTest(): boolean {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).get('visualTest') === 'real-head'
}

export function createRealHeadVisualFixture(): FaceAsset {
  const headCanvas = drawHeadCanvas()
  const faceTextureCanvas = drawFaceCanvas()
  const meshData = createFixtureMeshData(faceTextureCanvas)
  return {
    objectUrl: canvasToDataUrl(headCanvas),
    originalImageUrl: canvasToDataUrl(headCanvas),
    width: headCanvas.width,
    height: headCanvas.height,
    transform: { x: 0, y: 0, scale: 1, rotation: 0 },
    detectedFaces: 1,
    headCanvas,
    backHeadCanvas: headCanvas,
    faceTextureCanvas,
    landmarks: createFixtureLandmarks(),
    meshData,
  }
}

function drawHeadCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 520
  canvas.height = 640
  const ctx = requiredContext(canvas)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#111111'
  ctx.beginPath()
  ctx.ellipse(260, 210, 156, 168, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#f2bd8d'
  ctx.beginPath()
  ctx.ellipse(260, 318, 132, 176, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(124, 320, 34, 52, -0.1, 0, Math.PI * 2)
  ctx.ellipse(396, 320, 34, 52, 0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#151515'
  ctx.beginPath()
  ctx.moveTo(112, 220)
  ctx.bezierCurveTo(160, 72, 374, 66, 414, 230)
  ctx.bezierCurveTo(340, 174, 206, 172, 112, 220)
  ctx.fill()
  drawEyesAndMouth(ctx, 260, 320, 1)
  applySoftAlphaMask(canvas)
  return canvas
}

function drawFaceCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 360
  canvas.height = 430
  const ctx = requiredContext(canvas)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f2bd8d'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#e3a477'
  ctx.fillRect(0, 250, canvas.width, 180)
  drawEyesAndMouth(ctx, 180, 172, 0.86)
  return canvas
}

function drawEyesAndMouth(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.ellipse(cx - 58 * scale, cy - 16 * scale, 27 * scale, 14 * scale, 0, 0, Math.PI * 2)
  ctx.ellipse(cx + 58 * scale, cy - 16 * scale, 27 * scale, 14 * scale, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#1f2937'
  ctx.beginPath()
  ctx.arc(cx - 58 * scale, cy - 16 * scale, 8 * scale, 0, Math.PI * 2)
  ctx.arc(cx + 58 * scale, cy - 16 * scale, 8 * scale, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#7c2d12'
  ctx.lineWidth = 8 * scale
  ctx.beginPath()
  ctx.moveTo(cx - 38 * scale, cy + 82 * scale)
  ctx.quadraticCurveTo(cx, cy + 105 * scale, cx + 38 * scale, cy + 82 * scale)
  ctx.stroke()
}

function applySoftAlphaMask(canvas: HTMLCanvasElement) {
  const mask = document.createElement('canvas')
  mask.width = canvas.width
  mask.height = canvas.height
  const maskCtx = requiredContext(mask)
  const gradient = maskCtx.createRadialGradient(260, 332, 220, 260, 342, 330)
  gradient.addColorStop(0, 'rgba(0,0,0,1)')
  gradient.addColorStop(0.82, 'rgba(0,0,0,1)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  maskCtx.fillStyle = gradient
  maskCtx.beginPath()
  maskCtx.ellipse(260, 340, 226, 306, 0, 0, Math.PI * 2)
  maskCtx.fill()
  const ctx = requiredContext(canvas)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(mask, 0, 0)
  ctx.globalCompositeOperation = 'source-over'
}

function createFixtureMeshData(textureCanvas: HTMLCanvasElement): FaceMeshData {
  const columns = 8
  const rows = 10
  const width = 152
  const height = 182
  const offsetX = 0
  const offsetY = 6
  const vertexCount = columns * rows
  const vertices = new Float32Array(vertexCount * 2)
  const uvs = new Float32Array(vertexCount * 2)
  const regions: FaceRegion[] = []
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column
      const u = column / (columns - 1)
      const v = row / (rows - 1)
      uvs[index * 2] = u
      uvs[index * 2 + 1] = v
      vertices[index * 2] = u * width
      vertices[index * 2 + 1] = v * height
      regions[index] = classifyFixtureRegion(u, v)
    }
  }
  const indices: number[] = []
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const a = row * columns + column
      const b = a + 1
      const c = a + columns
      const d = c + 1
      indices.push(a, b, c, b, d, c)
    }
  }
  return {
    textureCanvas,
    vertices,
    restVertices: new Float32Array(vertices),
    velocities: new Float32Array(vertices.length),
    uvs,
    indices: new Uint32Array(indices),
    regions,
    width,
    height,
    offsetX,
    offsetY,
  }
}

function classifyFixtureRegion(u: number, v: number): FaceRegion {
  if (v > 0.24 && v < 0.42 && u < 0.42) return 'LEFT_EYE'
  if (v > 0.24 && v < 0.42 && u > 0.58) return 'RIGHT_EYE'
  if (v > 0.62 && v < 0.82 && u > 0.28 && u < 0.72) return 'MOUTH'
  if (v > 0.42 && v < 0.72 && u < 0.42) return 'LEFT_CHEEK'
  if (v > 0.42 && v < 0.72 && u > 0.58) return 'RIGHT_CHEEK'
  if (v > 0.78) return 'JAW'
  if (v < 0.2) return 'FOREHEAD'
  if (u > 0.42 && u < 0.58) return 'NOSE'
  return 'OTHER'
}

function createFixtureLandmarks(): FaceLandmark[] {
  return Array.from({ length: 80 }, (_, index) => ({
    x: (index % 8) / 7,
    y: Math.floor(index / 8) / 9,
    z: 0,
  }))
}

function requiredContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable.')
  return ctx
}

function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png')
}
