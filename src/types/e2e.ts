import type { SlapEvent } from './game'

export interface SlapE2ERenderState {
  defaultHeadVisible: boolean
  defaultEyesVisible: boolean
  defaultMouthVisible: boolean
  backHeadVisible: boolean
  faceMeshVisible: boolean
  eyeEffectsVisible: boolean
  eyeUvValid: boolean
  hairAlphaCoverage: number
  maxEyeDisplacement: number
  meshVertexCount: number
}

export interface SlapE2EApi {
  isReady: () => boolean
  pauseAnimations: () => void
  advanceFrames: (count: number) => void
  resetMesh: () => void
  applySlap: (event: SlapEvent) => void
  getRenderState: () => SlapE2ERenderState
}

declare global {
  interface Window {
    __SLAP_E2E__?: SlapE2EApi
  }
}
