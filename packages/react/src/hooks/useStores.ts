import { useMemo } from 'react'
import { Store, type JSONObject } from '@jsonui/core'

/**
 * Single-root store hook.
 *
 * - initialStore: a single Store instance (optional)
 * - defaultValues: Record<storeName, JSON> where each value is a JSON object
 *   representing that logical store's root.
 */
export function useStore(initialStore?: Store, defaultValues?: Record<string, JSONObject>): Store {
  return useMemo(() => {
    const root: Store = initialStore ?? new Store()

    if (defaultValues) {
      for (const [name, data] of Object.entries(defaultValues)) {
        if (!name || name.length === 0) continue
        // Initialise logical stores without marking them as "touched" –
        // touched tracking is for user interactions, not default values.
        root.setForStore(name, '/', data, false)
      }
    }

    return root
  }, [initialStore, defaultValues])
}
