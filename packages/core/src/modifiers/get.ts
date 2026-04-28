import type { ModifierContext } from '../util/types.js'
import { createGetModifier } from '../JsonUI/getModifier.js'

export function get(params: Record<string, unknown>, ctx: ModifierContext): unknown | Promise<unknown> {
  const store = ctx.store
  const getFn = createGetModifier(store)
  return getFn(params, ctx)
}
