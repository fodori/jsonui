import type { ModifierContext } from '../util/types.js'
import { createGetModifier } from '../JsonUI/getModifier.js'

export const get = (params: Record<string, unknown>, ctx: ModifierContext): unknown | Promise<unknown> => {
  const getFn = createGetModifier(ctx.formStore)
  return getFn(params, ctx)
}
