import { FaceLandmarker } from '@mediapipe/tasks-vision'
import type { FaceConnection } from './types'

let cachedTopology: Uint32Array | null = null

export function getOfficialFaceMeshTopology(landmarkCount: number): Uint32Array {
  cachedTopology ??= buildTriangleIndicesFromConnections(FaceLandmarker.FACE_LANDMARKS_TESSELATION, landmarkCount)
  return cachedTopology
}

export function buildTriangleIndicesFromConnections(connections: FaceConnection[], landmarkCount: number): Uint32Array {
  const neighbors = new Map<number, Set<number>>()
  for (const { start, end } of connections) {
    if (start < 0 || end < 0 || start >= landmarkCount || end >= landmarkCount || start === end) continue
    if (!neighbors.has(start)) neighbors.set(start, new Set())
    if (!neighbors.has(end)) neighbors.set(end, new Set())
    neighbors.get(start)?.add(end)
    neighbors.get(end)?.add(start)
  }

  const triangles: number[] = []
  for (let a = 0; a < landmarkCount; a += 1) {
    const aNeighbors = neighbors.get(a)
    if (!aNeighbors) continue
    for (const b of aNeighbors) {
      if (b <= a) continue
      const bNeighbors = neighbors.get(b)
      if (!bNeighbors) continue
      for (const c of aNeighbors) {
        if (c <= b) continue
        if (bNeighbors.has(c)) triangles.push(a, b, c)
      }
    }
  }
  const indices = new Uint32Array(triangles)
  validateTriangleIndices(indices, landmarkCount)
  return indices
}

export function validateTriangleIndices(indices: Uint32Array, landmarkCount: number): boolean {
  if (indices.length === 0 || indices.length % 3 !== 0) throw new Error('Face mesh topology must contain complete triangles.')
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i]
    const b = indices[i + 1]
    const c = indices[i + 2]
    if (a >= landmarkCount || b >= landmarkCount || c >= landmarkCount) throw new Error('Face mesh topology index is out of range.')
    if (a === b || b === c || a === c) throw new Error('Face mesh topology contains a degenerate triangle.')
  }
  return true
}
