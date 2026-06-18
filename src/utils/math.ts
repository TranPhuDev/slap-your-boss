export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1)
}
