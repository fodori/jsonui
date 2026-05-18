/**
 * Shared helpers for function handlers.
 */

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export const hasAnyError = (value: unknown): boolean => {
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

export const hasAnyTouched = (value: unknown): boolean => {
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
 * Throws if value contains anything that cannot round-trip through JSON:
 * undefined, function, symbol, bigint, NaN, non-finite numbers, or circular references.
 */
export const assertJsonCompatible = (value: unknown, seen = new WeakSet()): void => {
  if (value === null) return
  if (value === undefined) throw new Error('undefined is not JSON-compatible')

  const type = typeof value
  if (type === 'string' || type === 'boolean') return
  if (type === 'number') {
    if (!Number.isFinite(value)) throw new Error(`Non-finite number is not JSON-compatible: ${value}`)
    return
  }
  if (type === 'function' || type === 'symbol' || type === 'bigint') {
    throw new Error(`${type} is not JSON-compatible`)
  }

  const obj = value
  if (seen.has(obj)) throw new Error('Circular reference is not JSON-compatible')
  seen.add(obj)

  if (Array.isArray(value)) {
    for (const item of value as unknown[]) assertJsonCompatible(item, seen)
  } else {
    for (const v of Object.values(value as Record<string, unknown>)) assertJsonCompatible(v, seen)
  }

  seen.delete(obj)
}

/**
 * Deep clone helper used by get() so callers cannot mutate the internal store state.
 * Only JSON-compatible values are accepted; functions and other non-JSON types throw.
 */
export const cloneDeep = <T>(value: T): T => {
  if (value === null || value === undefined) return value

  const type = typeof value
  if (type !== 'object') {
    if (type === 'function' || type === 'symbol' || type === 'bigint') {
      throw new Error(`${type} is not JSON-compatible`)
    }
    if (type === 'number' && !Number.isFinite(value)) {
      throw new Error(`Non-finite number is not JSON-compatible: ${value}`)
    }
    return value
  }

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
