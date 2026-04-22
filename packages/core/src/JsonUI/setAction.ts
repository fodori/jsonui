import type { Store } from '../store.js'
import { getRootStore, resolveStorePath } from '../store.js'

export function createSetAction(stores: Record<string, Store>) {
  return async (
    params: Record<string, unknown>,
    ctx?: {
      currentPath: string
      pathModifiers?: Record<string, { path: string }>
    }
  ): Promise<void> => {
    const storeName = params.store as string
    const path = params.path as string
    let value = params.value
    const jsonataDef = params.jsonataDef as string | undefined
    if (!storeName || storeName.length === 0) return

    if (typeof jsonataDef === 'string' && jsonataDef) {
      try {
        const jsonata = (await import('jsonata')).default
        const expr = jsonata(jsonataDef)
        value = await expr.evaluate(value)
      } catch {
        value = params.value
      }
    }

    const root = getRootStore(stores)
    const logicalPath = resolveStorePath(path, ctx?.currentPath ?? '/', ctx?.pathModifiers, storeName)
    root.setForStore(storeName, logicalPath, value)
  }
}
