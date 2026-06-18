import { FaceLandmarker } from '@mediapipe/tasks-vision'
import type { FaceLandmark, FaceRegion } from './types'
import type { FaceConnection } from './types'

export function classifyFaceRegions(landmarks: FaceLandmark[]): FaceRegion[] {
  const leftEye = indicesFromConnections(FaceLandmarker.FACE_LANDMARKS_LEFT_EYE)
  const rightEye = indicesFromConnections(FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE)
  const lips = indicesFromConnections(FaceLandmarker.FACE_LANDMARKS_LIPS)
  const oval = indicesFromConnections(FaceLandmarker.FACE_LANDMARKS_FACE_OVAL)
  return classifyFaceRegionsWithSets(landmarks, { leftEye, rightEye, lips, oval })
}

export function classifyFaceRegionsWithSets(
  landmarks: FaceLandmark[],
  sets: { leftEye: Set<number>; rightEye: Set<number>; lips: Set<number>; oval: Set<number> },
): FaceRegion[] {
  const bounds = normalizedBounds(landmarks)
  const centerX = bounds.x + bounds.width / 2
  return landmarks.map((landmark, index) => {
    if (sets.leftEye.has(index)) return 'LEFT_EYE'
    if (sets.rightEye.has(index)) return 'RIGHT_EYE'
    if (sets.lips.has(index)) return 'MOUTH'
    const nx = bounds.width > 0 ? (landmark.x - bounds.x) / bounds.width : 0.5
    const ny = bounds.height > 0 ? (landmark.y - bounds.y) / bounds.height : 0.5
    if (sets.oval.has(index) && ny > 0.72) return 'JAW'
    if (ny < 0.23) return 'FOREHEAD'
    if (ny > 0.43 && ny < 0.76 && landmark.x < centerX && nx < 0.45) return 'LEFT_CHEEK'
    if (ny > 0.43 && ny < 0.76 && landmark.x >= centerX && nx > 0.55) return 'RIGHT_CHEEK'
    if (nx > 0.42 && nx < 0.58 && ny > 0.32 && ny < 0.68) return 'NOSE'
    return 'OTHER'
  })
}

function indicesFromConnections(connections: FaceConnection[]): Set<number> {
  const set = new Set<number>()
  for (const connection of connections) {
    set.add(connection.start)
    set.add(connection.end)
  }
  return set
}

function normalizedBounds(landmarks: FaceLandmark[]) {
  const xs = landmarks.map((landmark) => landmark.x)
  const ys = landmarks.map((landmark) => landmark.y)
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  const right = Math.max(...xs)
  const bottom = Math.max(...ys)
  return { x, y, width: right - x, height: bottom - y }
}
