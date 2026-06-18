import { clamp } from '../utils/math'
import type { GameResult, RoundState } from '../types/game'

export const DAMAGE_SCALING_RAW = 2100
export const STRESS_PER_SLAP = 1.1
export const STRESS_BEST_SLAP_WEIGHT = 0.22
export const FINAL_SCORE_DAMAGE_WEIGHT = 0.48
export const FINAL_SCORE_STRESS_WEIGHT = 0.32
export const FINAL_SCORE_BEST_SLAP_WEIGHT = 0.2

export function comboMultiplier(combo: number): number {
  return 1 + Math.min(combo, 30) * 0.03
}

export function faceDamageFromRaw(rawDamage: number): number {
  return clamp(Math.round(100 * (1 - Math.exp(-rawDamage / DAMAGE_SCALING_RAW))), 0, 100)
}

export function stressReleasedFromSlaps(totalSlaps: number, bestSlap: number): number {
  return clamp(Math.round(totalSlaps * STRESS_PER_SLAP + bestSlap * STRESS_BEST_SLAP_WEIGHT), 0, 100)
}

export function finalScore(faceDamage: number, stressReleased: number, bestSlap: number): number {
  return clamp(
    Math.round(
      faceDamage * FINAL_SCORE_DAMAGE_WEIGHT +
        stressReleased * FINAL_SCORE_STRESS_WEIGHT +
        Math.min(bestSlap, 100) * FINAL_SCORE_BEST_SLAP_WEIGHT,
    ),
    0,
    100,
  )
}

export function rankForScore(score: number): string {
  if (score >= 95) return 'Boss Battle Legend'
  if (score >= 85) return 'Executive Menace'
  if (score >= 70) return 'Corporate Survivor'
  if (score >= 60) return 'Meeting Breaker'
  if (score >= 50) return 'Deadline Fighter'
  if (score >= 30) return 'Office Rookie'
  return 'Calm Employee'
}

export function createGameResult(bossName: string, round: RoundState, durationMs: number): GameResult {
  return {
    bossName,
    durationMs,
    totalSlaps: round.totalSlaps,
    maxCombo: round.maxCombo,
    faceDamage: round.faceDamage,
    stressReleased: round.stressReleased,
    bestSlap: round.bestSlap,
    finalScore: round.finalScore,
    rank: rankForScore(round.finalScore),
  }
}
