import { resolveStorePath } from '../../store.js'
import { V_COMP, MODIFIER_KEY } from '../../types.js'
import type { StorePathDependency } from './resolutionTypes.js'

export function collectGetModifierDependencies(
  val: unknown,
  currentPath: string,
  effectivePathModifiers: Record<string, { path: string }> | undefined,
  deps: StorePathDependency[]
): void {
  if (val && typeof val === 'object' && !Array.isArray(val) && V_COMP in val) {
    return
  }
  if (val && typeof val === 'object' && !Array.isArray(val) && MODIFIER_KEY in val && (val as Record<string, unknown>)[MODIFIER_KEY] === 'get') {
    const storeName = (val as Record<string, unknown>).store as string | undefined
    const rawPathVal = (val as Record<string, unknown>).path
    if (storeName) {
      if (typeof rawPathVal === 'string' && rawPathVal) {
        const logicalPath = resolveStorePath(rawPathVal, currentPath, effectivePathModifiers, storeName)
        deps.push({ store: storeName, path: logicalPath })
      } else {
        deps.push({ store: storeName, path: '/' })
      }
    }
    return
  }
  if (Array.isArray(val)) {
    val.forEach((v) => collectGetModifierDependencies(v, currentPath, effectivePathModifiers, deps))
    return
  }
  if (val && typeof val === 'object') {
    for (const v of Object.values(val as Record<string, unknown>)) {
      collectGetModifierDependencies(v, currentPath, effectivePathModifiers, deps)
    }
  }
}
