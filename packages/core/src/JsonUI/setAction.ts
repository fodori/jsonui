import type { FormStore } from '../store/formStore.js'
import { resolveStorePath } from '../store/formStore.js'
import { ActionContext, JSONParams } from '../util/types.js'

export const createSetAction = (formStore: FormStore) => {
  return async (params: JSONParams, ctx?: Pick<ActionContext, 'currentPath' | 'pathModifiers'>): Promise<void> => {
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

    const logicalPath = resolveStorePath(path, ctx?.currentPath ?? '/', ctx?.pathModifiers, storeName)
    formStore.set(storeName, logicalPath, value)
  }
}
