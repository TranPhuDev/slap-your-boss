import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../game/constants'

export function normalizeBossName(value: string): string {
  return value.trim().slice(0, 30)
}

export function validateBossName(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Boss name is required.'
  if (trimmed.length > 30) return 'Boss name must be 30 characters or fewer.'
  return null
}

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return 'Use a JPG, PNG, or WEBP image.'
  }
  if (file.size > MAX_IMAGE_SIZE) return 'Image must be 10 MB or smaller.'
  return null
}
