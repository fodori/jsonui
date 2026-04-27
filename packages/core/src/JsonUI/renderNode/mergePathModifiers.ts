import type { JsonUINode } from '../../util/types.js'
import { resolveStorePath } from '../../store/store.js'
import { PATH_MODIFIERS_KEY } from '../../util/contants.js'

export function getOwnPathModifiers(node: JsonUINode): Record<string, { path: string }> | undefined {
  return (node as Record<string, unknown>)[PATH_MODIFIERS_KEY] as Record<string, { path: string }> | undefined
}

export function mergeEffectivePathModifiers(
  ownPathModifiers: Record<string, { path: string }> | undefined,
  pathModifiers: Record<string, { path: string }> | undefined,
  currentPath: string
): Record<string, { path: string }> | undefined {
  if (!ownPathModifiers || typeof ownPathModifiers !== 'object') {
    return pathModifiers
  }
  const merged: Record<string, { path: string }> = {
    ...(pathModifiers ?? {}),
  }

  for (const [storeName, spec] of Object.entries(ownPathModifiers)) {
    if (typeof spec !== 'object') continue
    const rawPath = (spec as { path?: string }).path
    if (typeof rawPath !== 'string' || rawPath.length === 0) continue

    const resolved = resolveStorePath(rawPath, currentPath, pathModifiers, storeName)
    merged[storeName] = { path: resolved }
  }

  return merged
}
