import { clamp } from '../../utils/math'
import type { FaceMeshData, FaceRegion, MeshSlapImpulse } from './types'

const SPRING = 0.12
const DAMPING = 0.82
const MAX_DISPLACEMENT = 28

export function gaussianFalloff(distance: number, radius: number): number {
  return Math.exp(-(distance * distance) / (2 * radius * radius))
}

export function applyMeshSlapImpulse(meshData: FaceMeshData, impulse: MeshSlapImpulse): void {
  const direction = impulse.direction === 'RIGHT' ? 1 : -1
  const damageMultiplier = 1 + impulse.faceDamage / 130
  const radius = Math.max(meshData.width, meshData.height) * 0.42
  for (let i = 0; i < meshData.vertices.length; i += 2) {
    const vertexIndex = i / 2
    const x = meshData.vertices[i]
    const y = meshData.vertices[i + 1]
    const dx = x - impulse.hitX
    const dy = y - impulse.hitY
    const falloff = gaussianFalloff(Math.hypot(dx, dy), radius)
    const regionWeight = weightForRegion(meshData.regions[vertexIndex], impulse.direction)
    const force = falloff * regionWeight * impulse.power * damageMultiplier
    meshData.velocities[i] += direction * force * 0.34
    meshData.velocities[i + 1] += Math.sign(dy || 1) * force * 0.09
  }
  clampDisplacements(meshData)
}

export function updateMeshSpring(meshData: FaceMeshData, deltaFrames: number): void {
  const normalized = clamp(deltaFrames, 0.25, 2)
  for (let i = 0; i < meshData.vertices.length; i += 1) {
    const springForce = (meshData.restVertices[i] - meshData.vertices[i]) * SPRING * normalized
    meshData.velocities[i] = (meshData.velocities[i] + springForce) * Math.pow(DAMPING, normalized)
    meshData.vertices[i] += meshData.velocities[i] * normalized
  }
  clampDisplacements(meshData)
}

export function resetMesh(meshData: FaceMeshData): void {
  meshData.vertices.set(meshData.restVertices)
  meshData.velocities.fill(0)
}

export function clampDisplacements(meshData: FaceMeshData, maxDisplacement = MAX_DISPLACEMENT): void {
  for (let i = 0; i < meshData.vertices.length; i += 2) {
    const restX = meshData.restVertices[i]
    const restY = meshData.restVertices[i + 1]
    const dx = meshData.vertices[i] - restX
    const dy = meshData.vertices[i + 1] - restY
    const distance = Math.hypot(dx, dy)
    if (distance > maxDisplacement) {
      const scale = maxDisplacement / distance
      meshData.vertices[i] = restX + dx * scale
      meshData.vertices[i + 1] = restY + dy * scale
      meshData.velocities[i] *= 0.35
      meshData.velocities[i + 1] *= 0.35
    }
  }
}

function weightForRegion(region: FaceRegion, direction: 'LEFT' | 'RIGHT'): number {
  if ((direction === 'RIGHT' && region === 'LEFT_CHEEK') || (direction === 'LEFT' && region === 'RIGHT_CHEEK')) return 1.55
  switch (region) {
    case 'MOUTH':
      return 1.18
    case 'JAW':
      return 1.05
    case 'NOSE':
      return 0.78
    case 'LEFT_EYE':
    case 'RIGHT_EYE':
      return 0.18
    case 'FOREHEAD':
      return 0.38
    case 'LEFT_CHEEK':
    case 'RIGHT_CHEEK':
      return 1.2
    default:
      return 0.72
  }
}
