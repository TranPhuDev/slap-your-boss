import { expect, test, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { SlapE2ERenderState } from '../../src/types/e2e'

const visualDir = join(process.cwd(), 'artifacts', 'visual')

test.beforeAll(() => {
  mkdirSync(visualDir, { recursive: true })
})

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/?visualTest=real-head')
  await page.waitForFunction(() => window.__SLAP_E2E__?.isReady() === true)
  await page.evaluate(() => {
    window.__SLAP_E2E__?.pauseAnimations()
    window.__SLAP_E2E__?.resetMesh()
    window.__SLAP_E2E__?.advanceFrames(4)
  })
  test.info().annotations.push({ type: 'consoleErrorsRef', description: JSON.stringify(errors) })
  ;(page as Page & { __consoleErrors?: string[] }).__consoleErrors = errors
})

test('idle real-head gameplay has no default face overlays', async ({ page }) => {
  const state = await getState(page)
  expect(state.defaultHeadVisible).toBe(false)
  expect(state.defaultEyesVisible).toBe(false)
  expect(state.defaultMouthVisible).toBe(false)
  expect(state.backHeadVisible).toBe(true)
  expect(state.faceMeshVisible).toBe(true)
  expect(state.eyeEffectsVisible).toBe(false)
  expect(state.eyeUvValid).toBe(true)
  expect(state.hairAlphaCoverage).toBeGreaterThan(0.2)
  expect(state.maxEyeDisplacement).toBeLessThan(0.5)
  expect(state.meshVertexCount).toBeGreaterThan(40)
  expect((page as Page & { __consoleErrors?: string[] }).__consoleErrors ?? []).toEqual([])

  await page.screenshot({ path: join(visualDir, 'real-head-idle.png'), fullPage: true })
  await expect(page).toHaveScreenshot('real-head-idle.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.02,
  })
})

test('real-head mesh deforms after slap without invalid eye UVs', async ({ page }) => {
  await page.evaluate(() => {
    window.__SLAP_E2E__?.applySlap({
      direction: 'RIGHT',
      inputType: 'SWIPE',
      power: 72,
      x: 420,
      y: 250,
      timestamp: performance.now(),
    })
    window.__SLAP_E2E__?.advanceFrames(2)
  })
  const state = await getState(page)
  expect(state.backHeadVisible).toBe(true)
  expect(state.faceMeshVisible).toBe(true)
  expect(state.eyeUvValid).toBe(true)
  expect(state.eyeEffectsVisible).toBe(false)
  expect(state.maxEyeDisplacement).toBeGreaterThan(0)
  expect(state.maxEyeDisplacement).toBeLessThanOrEqual(10)
  expect((page as Page & { __consoleErrors?: string[] }).__consoleErrors ?? []).toEqual([])

  await page.screenshot({ path: join(visualDir, 'real-head-after-slap.png'), fullPage: true })
  await expect(page).toHaveScreenshot('real-head-after-slap.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.02,
  })
})

async function getState(page: Page): Promise<SlapE2ERenderState> {
  return page.evaluate(() => {
    const state = window.__SLAP_E2E__?.getRenderState()
    if (!state) throw new Error('Missing __SLAP_E2E__ render state')
    return state
  })
}
