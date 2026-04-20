import type { ModifierContext } from '../types.js'
import { createSetAction } from '../JsonUI/setAction.js'

export function set(params: Record<string, unknown>, ctx: ModifierContext): void | Promise<void> {
  const stores = ctx.stores
  const setFn = createSetAction(stores)
  return setFn(params, ctx)
}
