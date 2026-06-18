import { clamp } from '../utils/math'
import type { GameResult, RoundState } from '../types/game'

export function comboMultiplier(combo: number): number {
  return 1 + Math.min(combo, 30) * 0.03
}

export function faceDamageFromRaw(rawDamage: number): number {
  return clamp(Math.round(100 * (1 - Math.exp(-rawDamage / 1200))), 0, 100)
}

export function stressReleasedFromSlaps(totalSlaps: number, bestSlap: number): number {
  return clamp(Math.round(totalSlaps * 1.8 + bestSlap * 0.35), 0, 100)
}

export function finalScore(faceDamage: number, stressReleased: number, bestSlap: number): number {
  return clamp(Math.round(faceDamage * 0.4 + stressReleased * 0.4 + Math.min(bestSlap, 100) * 0.2), 0, 100)
}

export function rankForScore(score: number): string {
  if (score >= 90) return 'Boss Battle Legend'
  if (score >= 70) return 'Corporate Survivor'
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
