import { useMemo } from 'react'
import { FormStore, JSONParams } from '@jsonui/core'
import { isRecord } from '../utils/isRecord.js'
/**
 * Single-root store hook.
 *
 * - initialStore: a single FormStore instance (optional)
 * - defaultValues: Record<storeName, JSON> where each value is a JSON object
 *   representing that logical store's root.
 */
export const useFormStore = (initialStore?: FormStore, defaultValues?: JSONParams): FormStore => {
  return useMemo(() => {
    const formStore = initialStore ?? new FormStore()

    if (isRecord(defaultValues)) {
      for (const [name, data] of Object.entries(defaultValues)) {
        if (typeof name !== 'string' || name.length === 0) continue
        // Initialise logical stores without marking them as "touched" –
        // touched tracking is for user interactions, not default values.
        formStore.setForStore(name, '/', data, false)
      }
    }

    return formStore
  }, [initialStore, defaultValues])
}
