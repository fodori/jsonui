/**
 * Expands simplified node format into full JSON UI node so components receive
 * value, onChange, error, etc. without the model having to specify every binding.
 *
 * When a node has store + path (non-empty store, string path), we add:
 * - value: { $modifier: 'get', store, path }
 * - onChange: { $action: 'set', store, path }
 * - error / fieldErrors: { $modifier: 'get', store: store + '.error', path }
 * - fieldTouched: { $modifier: 'get', store: store + '.touch', path }
 *
 * The component is unchanged; RenderNode uses the expanded node for prop
 * resolution and the expanded props are passed through normally.
 */

import type { JsonUINode } from '../types.js'
import { MODIFIER_KEY, ACTION_KEY, ERROR_STORE_SUFFIX, TOUCH_STORE_SUFFIX } from '../types.js'

function isSimplifiedNode(node: JsonUINode): node is JsonUINode & {
  [key: string]: unknown
  store: string
  path: string
} {
  if (!node || typeof node !== 'object') return false
  const r = node as Record<string, unknown>
  const store = r.store
  const path = r.path
  return typeof store === 'string' && store.length > 0 && typeof path === 'string'
}

/**
 * Returns an expanded node with value, onChange, error, fieldErrors, fieldTouched
 * derived from store + path. Strips store and path from the result so they are
 * not passed as component props.
 * If the node is not simplified, returns the same node reference.
 */
export function expandSimplifiedNode(node: JsonUINode): JsonUINode {
  if (!isSimplifiedNode(node)) return node

  const record = node as Record<string, unknown>
  const store = record.store as string
  const path = record.path as string
  const errorStore = `${store}${ERROR_STORE_SUFFIX}`
  const touchedStore = `${store}${TOUCH_STORE_SUFFIX}`

  const expanded: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(record)) {
    if (key === 'store' || key === 'path') {
      continue
    }
    expanded[key] = value
  }

  expanded.value = {
    [MODIFIER_KEY]: 'get',
    store,
    path,
  }
  expanded.onChange = {
    [ACTION_KEY]: 'set',
    store,
    path,
  }
  expanded.error = {
    [MODIFIER_KEY]: 'get',
    store: errorStore,
    path,
  }
  expanded.fieldErrors = {
    [MODIFIER_KEY]: 'get',
    store: errorStore,
    path,
  }
  expanded.fieldTouched = {
    [MODIFIER_KEY]: 'get',
    store: touchedStore,
    path,
  }

  return expanded
}
