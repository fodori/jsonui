import type { ModifierContext } from '../util/types.js'
import { createGetModifier } from '../JsonUI/getModifier.js'

export function get(params: Record<string, unknown>, ctx: ModifierContext): unknown | Promise<unknown> {
  const stores = ctx.stores
  const getFn = createGetModifier(stores)
  return getFn(params, ctx)
}
