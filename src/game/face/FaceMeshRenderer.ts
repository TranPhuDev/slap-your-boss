import { Container, Graphics, MeshSimple, Sprite, Texture } from 'pixi.js'
import { applyMeshSlapImpulse, resetMesh, updateMeshSpring } from './FaceDeformationSystem'
import type { FaceAsset, SlapEvent } from '../../types/game'
import type { SlapE2ERenderState } from '../../types/e2e'

export class FaceMeshRenderer {
  readonly container = new Container()
  private backHeadSprite: Sprite | null = null
  private mesh: MeshSimple | null = null
  private texture: Texture | null = null
  private outlineOverlay = new Graphics()
  private eyeEffects = new Graphics()
  private face: FaceAsset | null = null

  mount(face: FaceAsset): void {
    this.destroy()
    this.face = face
    this.container.removeChildren()

    const backTexture = Texture.from(face.backHeadCanvas)
    this.backHeadSprite = new Sprite(backTexture)
    this.backHeadSprite.anchor.set(0.5)
    this.backHeadSprite.width = 220
    this.backHeadSprite.height = 270
    this.backHeadSprite.alpha = 0.98

    this.texture = Texture.from(face.meshData.textureCanvas)
    this.mesh = new MeshSimple({
      texture: this.texture,
      vertices: face.meshData.vertices,
      uvs: face.meshData.uvs,
      indices: face.meshData.indices,
      topology: 'triangle-list',
    })
    this.mesh.autoUpdate = true
    this.mesh.x = face.meshData.offsetX - face.meshData.width / 2
    this.mesh.y = face.meshData.offsetY - face.meshData.height / 2

    this.outlineOverlay.clear()
    this.eyeEffects.clear().circle(-28, -22, 8).fill('#ffd23f').circle(28, -22, 8).fill('#ffd23f')
    this.eyeEffects.alpha = 1
    this.eyeEffects.visible = false
    this.container.addChild(this.backHeadSprite, this.mesh, this.outlineOverlay, this.eyeEffects)
  }

  applySlap(event: SlapEvent, faceDamage: number): void {
    if (!this.face) return
    const hitX = event.direction === 'RIGHT' ? this.face.meshData.width * 0.32 : this.face.meshData.width * 0.68
    const hitY = this.face.meshData.height * 0.54
    applyMeshSlapImpulse(this.face.meshData, {
      hitX,
      hitY,
      direction: event.direction,
      power: event.power,
      faceDamage,
    })
    this.eyeEffects.visible = event.power >= 82 || faceDamage >= 78
  }

  update(deltaFrames: number): void {
    if (!this.face || !this.mesh) return
    updateMeshSpring(this.face.meshData, deltaFrames)
    this.mesh.vertices = this.face.meshData.vertices
    if (this.eyeEffects.visible) this.eyeEffects.alpha = Math.max(0, this.eyeEffects.alpha - 0.05 * deltaFrames)
    if (this.eyeEffects.alpha <= 0) {
      this.eyeEffects.visible = false
      this.eyeEffects.alpha = 1
    }
  }

  isReady(): boolean {
    return this.face !== null && this.backHeadSprite !== null && this.mesh !== null
  }

  reset(): void {
    if (this.face) resetMesh(this.face.meshData)
  }

  hideEyeEffects(): void {
    this.eyeEffects.visible = false
    this.eyeEffects.alpha = 1
  }

  getRenderState(): SlapE2ERenderState {
    const meshData = this.face?.meshData
    return {
      defaultHeadVisible: false,
      defaultEyesVisible: false,
      defaultMouthVisible: false,
      backHeadVisible: this.backHeadSprite?.visible ?? false,
      faceMeshVisible: this.mesh?.visible ?? false,
      eyeEffectsVisible: this.eyeEffects.visible,
      eyeUvValid: meshData ? eyeUvValid(meshData) : false,
      hairAlphaCoverage: this.face ? hairAlphaCoverage(this.face.backHeadCanvas) : 0,
      maxEyeDisplacement: meshData ? maxEyeDisplacement(meshData) : 0,
      meshVertexCount: meshData ? meshData.vertices.length / 2 : 0,
    }
  }

  destroy(): void {
    this.reset()
    this.mesh?.destroy()
    this.mesh = null
    this.texture?.destroy(false)
    this.texture = null
    this.backHeadSprite?.destroy()
    this.backHeadSprite = null
    this.outlineOverlay.clear()
    this.eyeEffects.clear()
    this.container.removeChildren()
    this.face = null
  }
}

function eyeUvValid(meshData: FaceAsset['meshData']): boolean {
  return meshData.regions.every((region, index) => {
    if (region !== 'LEFT_EYE' && region !== 'RIGHT_EYE') return true
    const u = meshData.uvs[index * 2]
    const v = meshData.uvs[index * 2 + 1]
    return u >= 0 && u <= 1 && v >= 0 && v <= 1
  })
}

function maxEyeDisplacement(meshData: FaceAsset['meshData']): number {
  let max = 0
  meshData.regions.forEach((region, index) => {
    if (region !== 'LEFT_EYE' && region !== 'RIGHT_EYE') return
    const i = index * 2
    max = Math.max(max, Math.hypot(meshData.vertices[i] - meshData.restVertices[i], meshData.vertices[i + 1] - meshData.restVertices[i + 1]))
  })
  return max
}

function hairAlphaCoverage(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d')
  if (!ctx) return 0
  const sampleHeight = Math.max(1, Math.floor(canvas.height * 0.36))
  const data = ctx.getImageData(0, 0, canvas.width, sampleHeight).data
  let covered = 0
  const pixels = data.length / 4
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 24) covered += 1
  }
  return covered / pixels
}
