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

/**
 * Deep clone helper used by get() so callers cannot mutate the internal store state.
 * Objects and arrays are cloned recursively; primitives and functions are returned as-is.
 */
export function cloneDeep<T>(value: T): T {
  if (value == null) return value
  if (typeof value !== 'object') return value

  if (Array.isArray(value)) {
    return (value as unknown[]).map((item) => cloneDeep(item)) as unknown as T
  }

  const obj = value as Record<string, unknown>
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    result[key] = cloneDeep(obj[key])
  }
  return result as unknown as T
}
