import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import {
  buildFaceMeshData,
  cropRectFromLandmarks,
  cropRectFromLandmarksDirectional,
  drawIsolatedHeadCropToCanvas,
  drawCropToCanvas,
  drawSoftMaskedHeadCropToCanvas,
  faceCropFrameInHeadDisplay,
} from '../game/face/FaceMeshBuilder'
import { validateImageFile } from '../utils/validation'
import type { FaceAsset, FaceLandmark } from '../types/game'

let landmarkerPromise: Promise<FaceLandmarker> | null = null

export async function processFaceFile(file: File): Promise<FaceAsset> {
  const validation = validateImageFile(file)
  if (validation) throw new Error(validation)
  const originalImageUrl = URL.createObjectURL(file)
  const bitmap = await decodeImage(file)
  const resized = resizeBitmap(bitmap, 1280)
  bitmap.close()
  try {
    const landmarker = await getLandmarker()
    const detections = landmarker.detect(resized.canvas)
    if (!detections.faceLandmarks.length) throw new Error('No face found. Try a clearer front-facing photo.')
    const landmarks = selectLargestFace(detections.faceLandmarks, resized.canvas.width, resized.canvas.height)
    const headCrop = cropRectFromLandmarksDirectional(landmarks, resized.canvas.width, resized.canvas.height, {
      left: 0.85,
      right: 0.85,
      top: 1.55,
      bottom: 0.55,
    })
    const faceCrop = cropRectFromLandmarks(landmarks, resized.canvas.width, resized.canvas.height, 0.18, 0.22)
    const headCanvas = drawSoftMaskedHeadCropToCanvas(resized.canvas, headCrop, 520, 640)
    const backHeadCanvas = drawIsolatedHeadCropToCanvas(resized.canvas, headCrop, 520, 640)
    const faceTextureCanvas = drawCropToCanvas(resized.canvas, faceCrop, 360, 430)
    const faceDisplay = faceCropFrameInHeadDisplay(headCrop, faceCrop, 220, 270)
    const meshData = buildFaceMeshData(faceTextureCanvas, landmarks, {
      sourceWidth: resized.canvas.width,
      sourceHeight: resized.canvas.height,
      crop: faceCrop,
      displayWidth: faceDisplay.width,
      displayHeight: faceDisplay.height,
      offsetX: faceDisplay.x + faceDisplay.width / 2 - 110,
      offsetY: faceDisplay.y + faceDisplay.height / 2 - 135,
    })
    const objectUrl = await canvasToObjectUrl(headCanvas)
    return {
      objectUrl,
      width: headCanvas.width,
      height: headCanvas.height,
      transform: { x: 0, y: 0, scale: 1, rotation: 0 },
      detectedFaces: detections.faceLandmarks.length,
      originalImageUrl,
      headCanvas,
      backHeadCanvas,
      faceTextureCanvas,
      landmarks,
      meshData,
    }
  } catch (error) {
    URL.revokeObjectURL(originalImageUrl)
    throw error
  } finally {
    resized.release()
  }
}

export function formatFaceProcessingError(error: unknown): string {
  const raw = error instanceof Error ? error.message : typeof error === 'string' ? error : ''
  const message = raw.toLowerCase()
  if (message.includes('failed to fetch') || message.includes('network') || message.includes('wasm') || message.includes('model')) {
    return 'Face detector assets could not load. Check your internet connection, then choose the photo again.'
  }
  if (message.includes('decode') || message.includes('imagebitmap') || message.includes('invalid image')) {
    return 'This image could not be decoded. Try a JPG, PNG, or WEBP exported from your photo app.'
  }
  return raw || 'Could not process this image. Try a clearer JPG, PNG, or WEBP photo.'
}

async function getLandmarker(): Promise<FaceLandmarker> {
  landmarkerPromise ??= createLandmarker().catch((error: unknown) => {
    landmarkerPromise = null
    throw error
  })
  return landmarkerPromise
}

async function createLandmarker(): Promise<FaceLandmarker> {
  const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm')
  return FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
      delegate: 'CPU',
    },
    runningMode: 'IMAGE',
    numFaces: 4,
  })
}

async function decodeImage(file: File): Promise<ImageBitmap> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      return createBitmapFromImageElement(file)
    }
  }
  return createBitmapFromImageElement(file)
}

function createBitmapFromImageElement(file: File): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      createImageBitmap(image)
        .then(resolve)
        .catch(reject)
        .finally(() => URL.revokeObjectURL(url))
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Invalid image file.'))
    }
    image.src = url
  })
}

function resizeBitmap(bitmap: ImageBitmap, maxDimension: number) {
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable in this browser.')
  ctx.drawImage(bitmap, 0, 0, width, height)
  return {
    canvas,
    release: () => {
      canvas.width = 0
      canvas.height = 0
    },
  }
}

function selectLargestFace(faces: Array<Array<FaceLandmark>>, width: number, height: number): FaceLandmark[] {
  const bounds = faces.map((face) => {
    const xs = face.map((point) => point.x * width)
    const ys = face.map((point) => point.y * height)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const padX = (maxX - minX) * 0.28
    const padY = (maxY - minY) * 0.34
    const x = Math.max(0, minX - padX)
    const y = Math.max(0, minY - padY)
    const right = Math.min(width, maxX + padX)
    const bottom = Math.min(height, maxY + padY)
    return { face, x, y, width: right - x, height: bottom - y }
  })
  return bounds.sort((a, b) => b.width * b.height - a.width * a.height)[0].face
}

function canvasToObjectUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error('Could not create face preview.'))
      else resolve(URL.createObjectURL(blob))
    }, 'image/png')
  })
}
