import type { GameResult, SafeSettings, SafeStats } from '../types/game'

const settingsKey = 'slap-your-boss:settings'
const statsKey = 'slap-your-boss:stats'

const defaultSettings: SafeSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
}

const defaultStats: SafeStats = {
  totalGames: 0,
  highestScore: 0,
  highestDamage: 0,
  highestCombo: 0,
  bestSlap: 0,
}

export function loadSettings(): SafeSettings {
  const stored = safeParse<Partial<SafeSettings>>(settingsKey)
  return {
    soundEnabled: stored?.soundEnabled ?? defaultSettings.soundEnabled,
    vibrationEnabled: stored?.vibrationEnabled ?? defaultSettings.vibrationEnabled,
  }
}

export function saveSettings(settings: SafeSettings): void {
  localStorage.setItem(settingsKey, JSON.stringify(settings))
}

export function loadStats(): SafeStats {
  return { ...defaultStats, ...safeParse<Partial<SafeStats>>(statsKey) }
}

export function updateStats(result: GameResult): SafeStats {
  const current = loadStats()
  const next: SafeStats = {
    totalGames: current.totalGames + 1,
    highestScore: Math.max(current.highestScore, result.finalScore),
    highestDamage: Math.max(current.highestDamage, result.faceDamage),
    highestCombo: Math.max(current.highestCombo, result.maxCombo),
    bestSlap: Math.max(current.bestSlap, result.bestSlap),
  }
  localStorage.setItem(statsKey, JSON.stringify(next))
  return next
}

function safeParse<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}
