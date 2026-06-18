import type { FaceLandmark, FaceMeshData, FaceRegion, SlapDirection } from '../../types/game'

export type { FaceLandmark, FaceMeshData, FaceRegion }

export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

export interface MeshBuildOptions {
  sourceWidth: number
  sourceHeight: number
  crop: CropRect
  displayWidth: number
  displayHeight: number
  offsetX?: number
  offsetY?: number
}

export interface MeshSlapImpulse {
  hitX: number
  hitY: number
  direction: SlapDirection
  power: number
  faceDamage: number
}

export interface FaceConnection {
  start: number
  end: number
}
