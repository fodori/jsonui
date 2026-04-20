/**
 * Shared helpers for function handlers.
 */

export function hasAnyError(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) {
    return value.some((v) => hasAnyError(v))
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((v) => hasAnyError(v))
  }
  // Any non-null / non-undefined primitive counts as "has error".
  return true
}

export function hasAnyTouched(value: unknown): boolean {
  if (value === true) return true
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) {
    return value.some((v) => hasAnyTouched(v))
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((v) => hasAnyTouched(v))
  }
  return false
}
