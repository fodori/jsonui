import type { ModifierContext } from '../util/types.js'
import { createSetAction } from '../JsonUI/setAction.js'

export const set = (params: Record<string, unknown>, ctx: ModifierContext): void | Promise<void> => {
  const store = ctx.store
  const setFn = createSetAction(store)
  return setFn(params, ctx)
}
