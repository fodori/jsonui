import { resolveStorePath } from '../store/formStore.js'
import type { ActionContext, ActionMap, JSONParams, ModifierMap } from '../util/types.js'
import { createSetAction } from './setAction.js'
import { resolveModifier } from './resolveModifier.js'
import { runValidationsForPath } from './validation.js'
import { ACTION_KEY } from '../util/contants.js'

export const resolveAction = (value: unknown, actions: ActionMap, modifiers: ModifierMap, ctx: ActionContext): ((e: unknown) => Promise<void>) | undefined => {
  if (value != null && typeof value === 'object' && ACTION_KEY in value) {
    const { [ACTION_KEY]: actionName, ...params } = value as JSONParams
    const hasExplicitValue = Object.prototype.hasOwnProperty.call(value, 'value')

    // Extract modifiers from action ctx.
    const { componentProps, validators, ...modifierCtx } = ctx

    let handler = actions[actionName as string]

    if (!handler && actionName === 'set') {
      handler = createSetAction(ctx.formStore)
    }

    if (!handler) return undefined

    return async (e: unknown) => {
      // TODO: research, why componentProps need
      const safeComponentProps = typeof componentProps === 'object' ? componentProps : {}
      const resolvedParams: JSONParams = { ...safeComponentProps, ...params }
      // Case 1: value from event (input onChange) – only when the model
      // did NOT define a value explicitly.
      if (!hasExplicitValue && e != null && typeof e === 'object' && 'target' in e) {
        const target = (e as { target?: { value?: unknown } }).target
        if (target?.value !== undefined) resolvedParams.value = target.value
      }
      // Cases 2 & 3: static JSON value or nested $modifier value – both
      // flow through resolveModifier below and are preserved.
      for (const [k, v] of Object.entries(resolvedParams)) {
        resolvedParams[k] = await resolveModifier(v, modifiers, modifierCtx)
      }
      const result = handler(resolvedParams, ctx)
      if (result instanceof Promise) await result

      // Run validations for this store/path if configured
      const storeName = typeof resolvedParams.store === 'string' ? resolvedParams.store : undefined
      const rawPath = typeof resolvedParams.path === 'string' ? resolvedParams.path : undefined
      if (validators && storeName && rawPath) {
        // Resolve to logical path so validations work with lists, pathModifiers,
        // and relative paths (e.g. "score" inside /players/0).
        const logicalPath = resolveStorePath(rawPath, ctx.currentPath, ctx.pathModifiers, storeName)
        runValidationsForPath(validators, ctx.formStore, storeName, logicalPath)
      }
    }
  }
  return undefined
}
