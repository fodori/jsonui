import type { JSONParams, ModifierContext } from '../util/types.js'
import { createGetModifier } from '../JsonUI/getModifier.js'

export const get = (params: JSONParams, ctx: ModifierContext): unknown | Promise<unknown> => {
  const getFn = createGetModifier(ctx.formStore)
  return getFn(params, ctx)
}
