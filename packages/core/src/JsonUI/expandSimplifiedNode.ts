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

import { MODIFIER_KEY, ACTION_KEY, V_COMP } from '../util/contants.js'
import type { JsonUINode } from '../util/types.js'

const isSimplifiedNode = (
  node: unknown
): node is JsonUINode & {
  [key: string]: unknown
  store: string
  path: string
} => {
  if (typeof node !== 'object' || node === null) return false
  const r = node as JsonUINode
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
export const expandSimplifiedNode = (node: JsonUINode): JsonUINode => {
  if (!isSimplifiedNode(node) && node[V_COMP] !== 'SubmitButton') {
    return node
  }

  const { store, path, ...rest } = node

  const expanded = {
    ...(node[V_COMP] === 'SubmitButton'
      ? {
          onClick: {
            [ACTION_KEY]: 'submit',
          },
        }
      : {}),
    ...(isSimplifiedNode(node)
      ? {
          value: {
            [MODIFIER_KEY]: 'get',
            store,
            path,
          },
          onChange: {
            [ACTION_KEY]: 'set',
            store,
            path,
          },
          fieldErrors: {
            [MODIFIER_KEY]: 'get',
            store,
            path,
            type: 'ERROR',
          },
          fieldTouched: {
            [MODIFIER_KEY]: 'get',
            store,
            path,
            type: 'TOUCH',
          },
        }
      : {
          //if is not a simplified node, we should add store and path props
          store,
          path,
        }),
    ...rest,
  }

  return expanded
}
