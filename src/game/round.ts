import { COMBO_RESET_MS, COMBO_WINDOW_MS } from './constants'
import { comboMultiplier, faceDamageFromRaw, finalScore, stressReleasedFromSlaps } from './scoring'
import type { RoundState, SlapEvent } from '../types/game'

export function createInitialRoundState(): RoundState {
  return {
    startedAt: 0,
    now: 0,
    totalSlaps: 0,
    combo: 0,
    maxCombo: 0,
    rawDamage: 0,
    faceDamage: 0,
    stressReleased: 0,
    bestSlap: 0,
    finalScore: 0,
    lastSlapAt: -Infinity,
    lastComboAt: -Infinity,
  }
}

export function resetRoundState(startedAt: number): RoundState {
  return { ...createInitialRoundState(), startedAt, now: startedAt }
}

export function registerSlap(state: RoundState, event: SlapEvent): RoundState {
  const combo = event.timestamp - state.lastComboAt <= COMBO_WINDOW_MS ? state.combo + 1 : 1
  const rawDamage = state.rawDamage + event.power * comboMultiplier(combo)
  const faceDamage = faceDamageFromRaw(rawDamage)
  const totalSlaps = state.totalSlaps + 1
  const bestSlap = Math.max(state.bestSlap, Math.round(event.power))
  const stressReleased = stressReleasedFromSlaps(totalSlaps, bestSlap)
  return {
    startedAt: state.startedAt,
    now: event.timestamp,
    totalSlaps,
    combo,
    maxCombo: Math.max(state.maxCombo, combo),
    rawDamage,
    faceDamage,
    stressReleased,
    bestSlap,
    finalScore: finalScore(faceDamage, stressReleased, bestSlap),
    lastSlapAt: event.timestamp,
    lastComboAt: event.timestamp,
  }
}

export function comboAfterIdle(state: RoundState, now: number): number {
  return now - state.lastComboAt > COMBO_RESET_MS ? 0 : state.combo
}
