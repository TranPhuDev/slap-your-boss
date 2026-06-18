import { INPUT_COOLDOWN_MS } from './constants'
import { clamp, distance } from '../utils/math'
import type { SlapEvent } from '../types/game'

export interface PointerSnapshot {
  id: number
  x: number
  y: number
  time: number
}

export function createSlapFromGesture(
  start: PointerSnapshot,
  end: PointerSnapshot,
  bounds: DOMRect,
  lastSlapAt: number,
): SlapEvent | null {
  const duration = end.time - start.time
  const dx = end.x - start.x
  const dy = end.y - start.y
  const move = distance(start.x, start.y, end.x, end.y)
  const x = end.x - bounds.left
  const y = end.y - bounds.top
  if (end.time - lastSlapAt < INPUT_COOLDOWN_MS) return null
  const hit = isInHeadHitArea(x, y, bounds.width, bounds.height)
  if (!hit) return null
  if (move >= 40 && duration <= 500 && Math.abs(dx) > Math.abs(dy) * 1.25) {
    return {
      direction: dx > 0 ? 'RIGHT' : 'LEFT',
      inputType: 'SWIPE',
      power: clamp(40 + move * 0.8, 40, 100),
      x,
      y,
      timestamp: end.time,
    }
  }
  return null
}

export function isInHeadHitArea(x: number, y: number, width: number, height: number): boolean {
  // Widen the hit area to be very generous: no longer restricted to a narrow oval.
  // Allow hitting anywhere within the bounds of the gameplay stage width and a wide height range (10% to 90%).
  return x >= 0 && x <= width && y >= height * 0.1 && y <= height * 0.9
}
