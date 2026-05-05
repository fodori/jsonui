import { resolveStorePath } from '../../store/store.js'
import { V_COMP, MODIFIER_KEY, ERROR_STORE_SUFFIX, TOUCH_STORE_SUFFIX } from '../../util/contants.js'
import { PathModifier, StorePathDependency } from '../../util/types.js'

/**
 * Recursively walks a node's props value tree and collects all store path dependencies
 * introduced by `$modifier: 'get'` entries. For each `get` modifier found, it resolves
 * the logical store path (accounting for path modifiers and ERROR/TOUCH type variants)
 * and appends it to the `deps` array. Nodes with a `$comp` key are skipped to avoid
 * descending into nested component definitions.
 */
export function collectGetModifierDependencies(val: unknown, currentPath: string, deps: StorePathDependency[], effectivePathModifiers?: PathModifier): void {
  if (val && typeof val === 'object' && !Array.isArray(val) && V_COMP in val) {
    return
  }
  if (val && typeof val === 'object' && !Array.isArray(val) && MODIFIER_KEY in val && (val as Record<string, unknown>)[MODIFIER_KEY] === 'get') {
    const storeName = (val as Record<string, unknown>).store as string | undefined
    const type = (val as Record<string, unknown>).type as string | undefined
    const path = (val as Record<string, unknown>).path
    const alteredStoreName =
      type === 'ERROR' ? `${storeName ?? ''}${ERROR_STORE_SUFFIX}` : type === 'TOUCH' ? `${storeName ?? ''}${TOUCH_STORE_SUFFIX}` : storeName
    if (storeName && alteredStoreName) {
      if (typeof path === 'string' && path) {
        const logicalPath = resolveStorePath(path, currentPath, effectivePathModifiers, storeName)
        deps.push({ store: alteredStoreName, path: logicalPath })
      } else {
        deps.push({ store: alteredStoreName, path: '/' })
      }
    }
    return
  }
  if (Array.isArray(val)) {
    val.forEach((v) => collectGetModifierDependencies(v, currentPath, deps, effectivePathModifiers))
    return
  }
  if (val && typeof val === 'object') {
    for (const v of Object.values(val as Record<string, unknown>)) {
      collectGetModifierDependencies(v, currentPath, deps, effectivePathModifiers)
    }
  }
}
