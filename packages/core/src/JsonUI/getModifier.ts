import type { Store } from '../store.js'
import { getRootStore, resolveStorePath } from '../store.js'
import type { ModifierContext } from '../types.js'
import { ERROR_STORE_SUFFIX, TOUCH_STORE_SUFFIX } from '../types.js'

function hasAnyError(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) {
    return value.some((v) => hasAnyError(v))
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((v) => hasAnyError(v))
  }
  return true
}

function hasAnyTouched(value: unknown): boolean {
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

export function createGetModifier(stores: Record<string, Store>) {
  return async (params: Record<string, unknown>, ctx: ModifierContext): Promise<unknown> => {
    const storeName = params.store as string
    const path = params.path as string
    const type = params.type as string | undefined
    const jsonataDef = params.jsonataDef as string | undefined
    const root = getRootStore(stores)

    const resolvedStoreName = type === 'ERROR' ? `${storeName}${ERROR_STORE_SUFFIX}` : type === 'TOUCH' ? `${storeName}${TOUCH_STORE_SUFFIX}` : storeName

    // Path modifiers are keyed by the logical/base store (e.g. "data"),
    // not by shadow stores like "data.error".
    const logicalPath = resolveStorePath(path, ctx.currentPath, ctx.pathModifiers, storeName)
    let value = root.getForStore(resolvedStoreName, logicalPath)

    // For ERROR lookups, leaf-less containers (e.g. { players: [{}] })
    // mean there is no actual validation message in the subtree.
    if (type === 'ERROR' && !hasAnyError(value)) {
      value = undefined
    }
    // TODO need to test hasAnyTouched and hasAnyError
    if (type === 'TOUCH') {
      value = hasAnyTouched(value)
    }

    if (jsonataDef && value !== undefined) {
      try {
        const jsonata = (await import('jsonata')).default
        const expr = jsonata(jsonataDef)
        value = await expr.evaluate(value)
      } catch {
        // fallback
      }
    }
    return value
  }
}
