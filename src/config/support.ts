const OFFICIAL_KOFI_URL = 'https://ko-fi.com/slapyourboss'

export function normalizeKofiUrl(value: unknown): string {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    if (url.origin !== 'https://ko-fi.com') return ''
    if (url.pathname.replace(/\/$/, '') !== '/slapyourboss') return ''
    return OFFICIAL_KOFI_URL
  } catch {
    return ''
  }
}

export const KOFI_URL = normalizeKofiUrl(import.meta.env.VITE_KOFI_URL)
