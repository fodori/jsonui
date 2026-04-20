import type { ModifierContext } from '../types.js'

/**
 * Translation function: looks up key in ctx.translations using active language.
 */
export function t(params: Record<string, unknown>, ctx: ModifierContext): string | undefined {
  const key = (params as { key?: unknown }).key as string | undefined
  if (!key) return undefined

  const translations = ctx.translations ?? {}

  const langParam = (params as { lang?: unknown }).lang as string | undefined
  const baseLang = ctx.defaultLanguage || 'en'
  const activeLang = langParam || ctx.activeLanguage || baseLang

  const entry = translations[key]
  // If we're in the base language, or there is no translation table
  // for this key, just return the key as-is (baseline text).
  if (activeLang === baseLang || !entry) return key

  // Otherwise, use the requested language if available, falling back to key.
  return entry[activeLang] ?? key
}
