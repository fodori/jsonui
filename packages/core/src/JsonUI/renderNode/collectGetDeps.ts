import { resolveStorePath } from '../../store/store.js'
import { V_COMP, MODIFIER_KEY, ERROR_STORE_SUFFIX, TOUCH_STORE_SUFFIX } from '../../util/contants.js'
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
    const type = (val as Record<string, unknown>).type as string | undefined
    const depStoreName = type === 'ERROR' ? `${storeName ?? ''}${ERROR_STORE_SUFFIX}` : type === 'TOUCH' ? `${storeName ?? ''}${TOUCH_STORE_SUFFIX}` : storeName
    const rawPathVal = (val as Record<string, unknown>).path
    if (storeName && depStoreName) {
      if (typeof rawPathVal === 'string' && rawPathVal) {
        const logicalPath = resolveStorePath(rawPathVal, currentPath, effectivePathModifiers, storeName)
        deps.push({ store: depStoreName, path: logicalPath })
      } else {
        deps.push({ store: depStoreName, path: '/' })
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
