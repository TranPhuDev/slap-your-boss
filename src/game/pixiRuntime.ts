import { Application, Container, Graphics, Text } from 'pixi.js'
import { FaceMeshRenderer } from './face/FaceMeshRenderer'
import type { FaceAsset, SlapDirection, SlapEvent } from '../types/game'
import type { SlapE2ERenderState } from '../types/e2e'

export const SLAP_RECOIL_DURATION_MS = 760
export const IMPACT_PARTICLE_ALPHA_DECAY = 0.017
export const IMPACT_PARTICLE_RISE_PER_FRAME = 1.65

export class PixiSlapRuntime {
  private app: Application | null = null
  private root = new Container()
  private faceRenderer = new FaceMeshRenderer()
  private head = new Container()
  private body = new Container()
  private particles: Array<Graphics | Text> = []
  private animationId = 0
  private lastSlap: { direction: SlapDirection; at: number; power: number } | null = null
  private damage = 0

  async mount(host: HTMLElement, face: FaceAsset) {
    await this.destroy()
    this.app = new Application()
    await this.app.init({ resizeTo: host, antialias: true, backgroundAlpha: 0 })
    host.appendChild(this.app.canvas)
    this.app.stage.addChild(this.root)
    this.drawCharacter(face)
    this.app.ticker.add(this.tick)
  }

  applySlap(event: SlapEvent) {
    this.lastSlap = { direction: event.direction, at: performance.now(), power: event.power }
    this.damage = Math.min(100, this.damage + event.power * 0.16)
    this.faceRenderer.applySlap(event, this.damage)
    this.spawnImpact(event.direction)
  }

  isReady(): boolean {
    return this.app !== null && this.faceRenderer.isReady()
  }

  pauseAnimations(): void {
    this.app?.ticker.stop()
    this.lastSlap = null
    this.particles.forEach((particle) => particle.removeFromParent())
    this.particles = []
    this.body.y = 0
    this.body.rotation = 0
    this.head.rotation = 0
    this.head.x = 0
    this.head.scale.set(1)
    this.faceRenderer.hideEyeEffects()
  }

  advanceFrames(count: number): void {
    for (let i = 0; i < count; i += 1) this.tick()
  }

  resetMesh(): void {
    this.faceRenderer.reset()
    this.faceRenderer.hideEyeEffects()
  }

  getRenderState(): SlapE2ERenderState {
    return this.faceRenderer.getRenderState()
  }

  private drawCharacter(face: FaceAsset) {
    if (!this.app) return
    const w = this.app.screen.width
    const h = this.app.screen.height
    this.root.removeChildren()
    this.root.x = w / 2
    this.root.y = h * 0.55
    this.body = new Container()
    const suit = new Graphics()
      .roundRect(-125, 70, 250, 240, 24)
      .fill('#1f2937')
      .poly([-55, 70, 0, 205, 55, 70])
      .fill('#f8fafc')
      .poly([0, 95, 28, 235, 0, 290, -28, 235])
      .fill('#d52924')
    const arms = new Graphics()
      .roundRect(-185, 105, 75, 185, 34)
      .fill('#111827')
      .roundRect(110, 105, 75, 185, 34)
      .fill('#111827')
    this.body.addChild(arms, suit)
    this.head = new Container()
    this.head.y = -86
    this.faceRenderer.mount(face)
    this.head.addChild(this.faceRenderer.container)
    this.root.addChild(this.body, this.head)
  }

  private tick = () => {
    const elapsed = performance.now() / 1000
    this.body.y = Math.sin(elapsed * 2) * 4
    this.body.rotation = Math.sin(elapsed * 1.4) * 0.015
    this.faceRenderer.update(1)
    if (this.lastSlap) {
      const age = Math.min(1, (performance.now() - this.lastSlap.at) / SLAP_RECOIL_DURATION_MS)
      const impulse = (1 - age) * (this.lastSlap.direction === 'RIGHT' ? 1 : -1)
      const power = this.lastSlap.power / 100
      this.head.rotation = impulse * 0.32 * power
      this.head.x = impulse * 34 * power
      this.head.scale.x = 1 + Math.abs(impulse) * 0.05 * power
      this.head.scale.y = 1 - Math.abs(impulse) * 0.035 * power
      if (age >= 1) this.lastSlap = null
    } else {
      this.head.rotation *= 0.84
      this.head.x *= 0.84
      this.head.scale.x += (1 - this.head.scale.x) * 0.18
      this.head.scale.y += (1 - this.head.scale.y) * 0.18
    }
    for (const particle of this.particles) {
      particle.alpha -= IMPACT_PARTICLE_ALPHA_DECAY
      particle.y -= IMPACT_PARTICLE_RISE_PER_FRAME
      particle.rotation += 0.08
      if (particle.alpha <= 0) {
        particle.removeFromParent()
      }
    }
    this.particles = this.particles.filter((particle) => particle.alpha > 0)
  }

  private spawnImpact(direction: SlapDirection) {
    const sign = direction === 'RIGHT' ? -1 : 1
    const labels = ['SLAP!', 'POW!', 'BONK!', 'WHACK!', 'BAM!']
    const damageLevel = Math.min(5, Math.floor(this.damage / 20) + 1)
    for (let i = 0; i < 6 + damageLevel * 2; i += 1) {
      const star = new Graphics().star(sign * 90 + Math.random() * 60, -130 + Math.random() * 100, 5, 8 + Math.random() * 14, 4).fill(
        i % 2 ? '#ffd23f' : '#d52924',
      )
      this.root.addChild(star)
      this.particles.push(star)
    }
    const text = new Text({
      text: labels[Math.floor(Math.random() * labels.length)],
      style: {
        fill: '#ffffff',
        fontFamily: 'system-ui',
        fontSize: 28 + damageLevel * 2,
        fontWeight: '900',
        stroke: { color: '#111827', width: 6 },
      },
    })
    text.anchor.set(0.5)
    text.x = sign * 105
    text.y = -170
    text.rotation = sign * 0.16
    this.root.addChild(text)
    this.particles.push(text)
    if (damageLevel >= 4) {
      const dizzy = new Graphics().circle(0, -230, 12 + damageLevel).fill('#ffd23f').stroke({ color: '#111827', width: 3 })
      this.root.addChild(dizzy)
      this.particles.push(dizzy)
    }
  }

  async destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId)
    this.particles = []
    this.faceRenderer.destroy()
    if (this.app) {
      this.app.ticker.remove(this.tick)
      this.app.destroy(true, { children: true, texture: true })
      this.app = null
    }
  }
}
