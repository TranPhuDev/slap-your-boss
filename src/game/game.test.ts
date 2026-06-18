import { describe, expect, it } from 'vitest'
import { comboAfterIdle, registerSlap, resetRoundState } from './round'
import { comboMultiplier, faceDamageFromRaw, finalScore, rankForScore, stressReleasedFromSlaps } from './scoring'
import { createSlapFromGesture } from './input'
import { IMPACT_PARTICLE_ALPHA_DECAY, SLAP_RECOIL_DURATION_MS } from './pixiRuntime'
import { clamp } from '../utils/math'
import { validateBossName, validateImageFile } from '../utils/validation'
import { formatFaceProcessingError } from '../services/faceProcessing'
import { applyMeshSlapImpulse, clampDisplacements, gaussianFalloff, resetMesh, updateMeshSpring } from './face/FaceDeformationSystem'
import { buildTriangleIndicesFromConnections, getOfficialFaceMeshTopology, validateTriangleIndices } from './face/faceMeshTopology'
import { buildUvs, buildVerticesFromUvs, cropRectFromLandmarksDirectional, faceCropFrameInHeadDisplay } from './face/FaceMeshBuilder'
import { classifyFaceRegionsWithSets } from './face/FaceRegionClassifier'
import type { FaceMeshData } from '../types/game'

describe('game formulas', () => {
  it('clamps values', () => {
    expect(clamp(12, 0, 10)).toBe(10)
    expect(clamp(-1, 0, 10)).toBe(0)
  })

  it('validates boss names', () => {
    expect(validateBossName('   ')).toBeTruthy()
    expect(validateBossName('Boss')).toBeNull()
    expect(validateBossName('x'.repeat(31))).toBeTruthy()
  })

  it('validates images', () => {
    expect(validateImageFile(new File(['x'], 'a.txt', { type: 'text/plain' }))).toBeTruthy()
    expect(validateImageFile(new File(['x'], 'a.png', { type: 'image/png' }))).toBeNull()
  })

  it('computes combo and scoring boundaries', () => {
    expect(comboMultiplier(0)).toBe(1)
    expect(comboMultiplier(40)).toBeCloseTo(1.9)
    expect(faceDamageFromRaw(0)).toBe(0)
    expect(faceDamageFromRaw(5000)).toBeLessThanOrEqual(100)
    expect(stressReleasedFromSlaps(100, 100)).toBe(100)
    expect(finalScore(100, 100, 100)).toBe(100)
    expect(rankForScore(29)).toBe('Calm Employee')
    expect(rankForScore(90)).toBe('Boss Battle Legend')
  })

  it('registers and resets combo', () => {
    let state = resetRoundState(0)
    state = registerSlap(state, { direction: 'LEFT', inputType: 'TAP', power: 30, x: 1, y: 1, timestamp: 100 })
    state = registerSlap(state, { direction: 'LEFT', inputType: 'TAP', power: 30, x: 1, y: 1, timestamp: 400 })
    expect(state.combo).toBe(2)
    expect(comboAfterIdle(state, 1200)).toBe(0)
  })

  it('classifies taps and swipes once from pointer up', () => {
    const rect = { left: 0, top: 0, width: 400, height: 500 } as DOMRect
    const tap = createSlapFromGesture({ id: 1, x: 200, y: 180, time: 0 }, { id: 1, x: 204, y: 182, time: 100 }, rect, -1000)
    const swipe = createSlapFromGesture({ id: 1, x: 130, y: 180, time: 0 }, { id: 1, x: 230, y: 185, time: 180 }, rect, -1000)
    expect(tap).toBeNull()
    expect(swipe?.inputType).toBe('SWIPE')
  })

  it('formats face-processing failures without hiding useful causes', () => {
    expect(formatFaceProcessingError('Failed to fetch')).toContain('assets could not load')
    expect(formatFaceProcessingError(new Error('ImageBitmap failed'))).toContain('could not be decoded')
    expect(formatFaceProcessingError({})).toContain('Try a clearer')
  })

  it('builds stable UVs and vertices from crop-relative landmarks', () => {
    const uvs = buildUvs(
      [
        { x: 0.25, y: 0.25 },
        { x: 0.75, y: 0.75 },
      ],
      { sourceWidth: 100, sourceHeight: 100, crop: { x: 20, y: 20, width: 60, height: 60 } },
    )
    expect(Array.from(uvs)).toEqual([expect.closeTo(0.0833, 3), expect.closeTo(0.0833, 3), expect.closeTo(0.9166, 3), expect.closeTo(0.9166, 3)])
    expect(Array.from(buildVerticesFromUvs(uvs, 120, 240))).toEqual([
      expect.closeTo(10, 1),
      expect.closeTo(20, 1),
      expect.closeTo(110, 1),
      expect.closeTo(220, 1),
    ])
  })

  it('expands the head crop beyond the face box to include hair and ears', () => {
    const crop = cropRectFromLandmarksDirectional(
      [
        { x: 0.4, y: 0.3 },
        { x: 0.6, y: 0.7 },
      ],
      1000,
      1000,
      { left: 0.6, right: 0.6, top: 0.9, bottom: 0.4 },
    )
    expect(crop.x).toBeCloseTo(280)
    expect(crop.y).toBe(0)
    expect(crop.width).toBeCloseTo(440)
    expect(crop.height).toBeCloseTo(860)
  })

  it('maps face crop placement inside the head display for separated back head and mesh layers', () => {
    const frame = faceCropFrameInHeadDisplay(
      { x: 100, y: 50, width: 400, height: 500 },
      { x: 180, y: 150, width: 220, height: 260 },
      200,
      250,
    )
    expect(frame.x).toBeCloseTo(40)
    expect(frame.y).toBeCloseTo(50)
    expect(frame.width).toBeCloseTo(110)
    expect(frame.height).toBeCloseTo(130)
  })

  it('derives valid triangles from official-style tessellation edges', () => {
    const indices = buildTriangleIndicesFromConnections(
      [
        { start: 0, end: 1 },
        { start: 1, end: 2 },
        { start: 2, end: 0 },
        { start: 1, end: 3 },
        { start: 2, end: 3 },
      ],
      4,
    )
    expect(Array.from(indices)).toEqual([0, 1, 2, 1, 2, 3])
    expect(validateTriangleIndices(indices, 4)).toBe(true)
    expect(validateTriangleIndices(getOfficialFaceMeshTopology(478), 478)).toBe(true)
  })

  it('classifies eyes, mouth, cheeks, jaw, forehead, and nose', () => {
    const regions = classifyFaceRegionsWithSets(
      [
        { x: 0.2, y: 0.1 },
        { x: 0.2, y: 0.5 },
        { x: 0.8, y: 0.5 },
        { x: 0.5, y: 0.52 },
        { x: 0.5, y: 0.82 },
        { x: 0.3, y: 0.35 },
        { x: 0.7, y: 0.35 },
        { x: 0.5, y: 0.68 },
      ],
      {
        leftEye: new Set([5]),
        rightEye: new Set([6]),
        lips: new Set([7]),
        oval: new Set([4]),
      },
    )
    expect(regions).toEqual(['FOREHEAD', 'LEFT_CHEEK', 'RIGHT_CHEEK', 'NOSE', 'JAW', 'LEFT_EYE', 'RIGHT_EYE', 'MOUTH'])
  })

  it('applies region-weighted impulses, clamps displacement, springs back, and resets mesh', () => {
    const mesh = createTestMesh()
    expect(gaussianFalloff(0, 10)).toBe(1)
    applyMeshSlapImpulse(mesh, { hitX: 10, hitY: 10, direction: 'RIGHT', power: 90, faceDamage: 70 })
    expect(mesh.velocities[0]).toBeGreaterThan(0)
    updateMeshSpring(mesh, 1)
    expect(mesh.vertices[0]).toBeGreaterThan(mesh.restVertices[0])
    expect(mesh.vertices[0]).not.toBe(mesh.vertices[2])
    for (let i = 0; i < 80; i += 1) updateMeshSpring(mesh, 1)
    expect(Math.abs(mesh.vertices[0] - mesh.restVertices[0])).toBeLessThan(2)
    mesh.vertices[0] = 999
    clampDisplacements(mesh, 20)
    expect(Math.abs(mesh.vertices[0] - mesh.restVertices[0])).toBeLessThanOrEqual(20)
    const sameVertices = mesh.vertices
    resetMesh(mesh)
    expect(mesh.vertices).toBe(sameVertices)
    expect(Array.from(mesh.velocities)).toEqual([0, 0, 0, 0, 0, 0])
  })

  it('keeps slap feedback visible long enough to read', () => {
    expect(SLAP_RECOIL_DURATION_MS).toBeGreaterThanOrEqual(700)
    expect(SLAP_RECOIL_DURATION_MS).toBeLessThanOrEqual(900)
    expect(IMPACT_PARTICLE_ALPHA_DECAY).toBeLessThan(0.025)
    expect(IMPACT_PARTICLE_ALPHA_DECAY).toBeGreaterThan(0.01)
  })
})

function createTestMesh(): FaceMeshData {
  const vertices = new Float32Array([10, 10, 50, 10, 30, 50])
  return {
    textureCanvas: {} as HTMLCanvasElement,
    vertices,
    restVertices: new Float32Array(vertices),
    velocities: new Float32Array(vertices.length),
    uvs: new Float32Array([0, 0, 1, 0, 0.5, 1]),
    indices: new Uint32Array([0, 1, 2]),
    regions: ['LEFT_CHEEK', 'RIGHT_EYE', 'MOUTH'],
    width: 60,
    height: 70,
    offsetX: 0,
    offsetY: 0,
  }
}
