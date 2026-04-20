import type { Store } from '../store.js'
import { getRootStore, resolveStorePath } from '../store.js'

export function createSetAction(stores: Record<string, Store>) {
  return (
    params: Record<string, unknown>,
    ctx?: {
      currentPath: string
      pathModifiers?: Record<string, { path: string }>
    }
  ): void => {
    const storeName = params.store as string
    const path = params.path as string
    const value = params.value
    if (!storeName || storeName.length === 0) return

    const root = getRootStore(stores)
    const logicalPath = resolveStorePath(path, ctx?.currentPath ?? '/', ctx?.pathModifiers, storeName)
    root.setForStore(storeName, logicalPath, value)
  }
}
