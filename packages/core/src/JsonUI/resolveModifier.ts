import { MODIFIER_KEY } from '../util/contants.js'
import type { ModifierContext, ModifierMap } from '../util/types.js'
import { createGetModifier } from './getModifier.js'

/**
 * Resolves $modifier (and nested values) anywhere in the tree.
 * Modifiers can appear at component root (value, onChange, etc.), in nested
 * structures (e.g. style.fontSize, style.base.padding), or in $child* slot content.
 * We recurse into objects and arrays so every occurrence is resolved.
 */
//TODO add unit test to the resolveModifier
export async function resolveModifier(value: unknown, modifiers: ModifierMap, ctx: ModifierContext): Promise<unknown> {
  // If it's a direct modifier object: { $modifier: 'x', ...params }
  if (value != null && typeof value === 'object' && MODIFIER_KEY in value) {
    const mod = (value as Record<string, unknown>)[MODIFIER_KEY] as string
    const params = { ...(value as Record<string, unknown>) }
    delete params[MODIFIER_KEY]

    const resolvedParams: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(params)) {
      resolvedParams[k] = await resolveModifier(v, modifiers, ctx)
    }

    const handler = modifiers[mod] ?? (mod === 'get' ? createGetModifier(ctx.store) : undefined)
    if (!handler) return undefined

    const result = handler(resolvedParams, ctx)
    return result instanceof Promise ? await result : result
  }

  // If it's an array, resolve modifiers in each element.
  if (Array.isArray(value)) {
    const resolved = await Promise.all(value.map((item) => resolveModifier(item, modifiers, ctx)))
    return resolved
  }

  // If it's a plain object without $modifier, traverse its properties
  // so nested fields like www2.bbb or payload.value get resolved.
  if (value != null && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const entries = Object.entries(obj)
    if (entries.length === 0) return value

    const resolvedObj: Record<string, unknown> = {}
    for (const [k, v] of entries) {
      resolvedObj[k] = await resolveModifier(v, modifiers, ctx)
    }
    return resolvedObj
  }

  // Primitive or null – nothing to do.
  return value
}
