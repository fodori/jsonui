import type { FormStore } from '../store/formStore.js'
import { resolveStorePath } from '../store/formStore.js'
import { ERROR_STORE_SUFFIX, TOUCH_STORE_SUFFIX } from '../util/contants.js'
import type { ModifierContext } from '../util/types.js'

const hasAnyError = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) {
    return value.some((v) => hasAnyError(v))
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((v) => hasAnyError(v))
  }
  return true
}

const hasAnyTouched = (value: unknown): boolean => {
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

export const createGetModifier = (formStore: FormStore) => {
  return async (params: Record<string, unknown> | undefined, ctx: ModifierContext): Promise<unknown> => {
    const storeName = !!params?.store && typeof params.store === 'string' ? params.store : ''
    const path = !!params?.path && typeof params.path === 'string' ? params.path : '/'
    const type = !!params?.type && typeof params.type === 'string' ? params.type : undefined
    const jsonataDef = params?.jsonataDef as string | undefined

    if (storeName.length === 0) return undefined

    const resolvedStoreName = type === 'ERROR' ? `${storeName}${ERROR_STORE_SUFFIX}` : type === 'TOUCH' ? `${storeName}${TOUCH_STORE_SUFFIX}` : storeName

    // Path modifiers are keyed by the logical/base store (e.g. "data"),
    // not by shadow stores like "data.error".
    const logicalPath = resolveStorePath(path, ctx.currentPath, ctx.pathModifiers, storeName)
    let value = formStore.get(resolvedStoreName, logicalPath)

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
