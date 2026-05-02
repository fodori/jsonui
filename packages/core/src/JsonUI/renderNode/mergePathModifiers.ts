import type { JsonUINode, PathModifier } from '../../util/types.js'
import { resolveStorePath } from '../../store/store.js'
import { PATH_MODIFIERS_KEY } from '../../util/contants.js'

export function getOwnPathModifiers(node: JsonUINode): PathModifier | undefined {
  return (node as Record<string, unknown>)[PATH_MODIFIERS_KEY] as PathModifier | undefined
}

export function mergeEffectivePathModifiers({
  ownPathModifiers,
  pathModifiers,
  currentPath,
}: {
  ownPathModifiers?: PathModifier
  pathModifiers?: PathModifier
  currentPath: string
}): PathModifier | undefined {
  if (!ownPathModifiers || typeof ownPathModifiers !== 'object') {
    return pathModifiers
  }
  const merged: PathModifier = {
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
