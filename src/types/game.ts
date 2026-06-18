export type GamePhase = 'LANDING' | 'COUNTDOWN' | 'PLAYING' | 'RESULT'

export type SlapDirection = 'LEFT' | 'RIGHT'
export type SlapInputType = 'TAP' | 'SWIPE'

export interface SlapEvent {
  direction: SlapDirection
  inputType: SlapInputType
  power: number
  x: number
  y: number
  timestamp: number
}

export interface FaceTransform {
  x: number
  y: number
  scale: number
  rotation: number
}

export interface FaceAsset {
  objectUrl: string
  width: number
  height: number
  transform: FaceTransform
  detectedFaces: number
  originalImageUrl: string
  headCanvas: HTMLCanvasElement
  backHeadCanvas: HTMLCanvasElement
  faceTextureCanvas: HTMLCanvasElement
  landmarks: FaceLandmark[]
  meshData: FaceMeshData
}

export interface BossProfile {
  name: string
  originalImageUrl: string
  headCanvas: HTMLCanvasElement
  backHeadCanvas: HTMLCanvasElement
  faceTextureCanvas: HTMLCanvasElement
  landmarks: FaceLandmark[]
  meshData: FaceMeshData
  faceTransform: FaceTransform
}

export interface FaceLandmark {
  x: number
  y: number
  z?: number
}

export type FaceRegion =
  | 'LEFT_CHEEK'
  | 'RIGHT_CHEEK'
  | 'LEFT_EYE'
  | 'RIGHT_EYE'
  | 'MOUTH'
  | 'NOSE'
  | 'JAW'
  | 'FOREHEAD'
  | 'OTHER'

export interface FaceMeshData {
  textureCanvas: HTMLCanvasElement
  vertices: Float32Array
  restVertices: Float32Array
  velocities: Float32Array
  uvs: Float32Array
  indices: Uint32Array
  regions: FaceRegion[]
  width: number
  height: number
  offsetX: number
  offsetY: number
}

export interface RoundState {
  startedAt: number
  now: number
  totalSlaps: number
  combo: number
  maxCombo: number
  rawDamage: number
  faceDamage: number
  stressReleased: number
  bestSlap: number
  finalScore: number
  lastSlapAt: number
  lastComboAt: number
}

export interface GameResult {
  bossName: string
  durationMs: number
  totalSlaps: number
  maxCombo: number
  faceDamage: number
  stressReleased: number
  bestSlap: number
  finalScore: number
  rank: string
}

export interface SafeSettings {
  soundEnabled: boolean
  vibrationEnabled: boolean
}

export interface SafeStats {
  totalGames: number
  highestScore: number
  highestDamage: number
  highestCombo: number
  bestSlap: number
}
