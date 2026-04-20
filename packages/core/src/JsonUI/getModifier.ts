import type { Store } from '../store.js'
import { getRootStore, resolveStorePath } from '../store.js'
import type { ModifierContext } from '../types.js'

export function createGetModifier(stores: Record<string, Store>) {
  return async (params: Record<string, unknown>, ctx: ModifierContext): Promise<unknown> => {
    const storeName = params.store as string
    const path = params.path as string
    const jsonataDef = params.jsonataDef as string | undefined
    const root = getRootStore(stores)

    const logicalPath = resolveStorePath(path, ctx.currentPath, ctx.pathModifiers, storeName)
    let value = root.getForStore(storeName, logicalPath)

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
