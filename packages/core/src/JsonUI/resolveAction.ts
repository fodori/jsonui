import type { Store } from '../store/store.js'
import { resolveStorePath } from '../store/store.js'
import type { ActionContext, ActionMap, ModifierMap } from '../util/types.js'
import { createSetAction } from './setAction.js'
import { resolveModifier } from './resolveModifier.js'
import { runValidationsForPath, type ValidationRegistry } from './validation.js'
import { ACTION_KEY } from '../util/contants.js'

export function resolveAction(
  value: unknown,
  actions: ActionMap,
  modifiers: ModifierMap,
  store: Store,
  ctx: ActionContext & {
    validators?: ValidationRegistry
  }
): ((e: unknown) => Promise<void>) | undefined {
  if (value != null && typeof value === 'object' && ACTION_KEY in value) {
    const actionName = (value as Record<string, unknown>)[ACTION_KEY] as string
    const params = { ...(value as Record<string, unknown>) }
    delete params[ACTION_KEY]
    const hasExplicitValue = Object.prototype.hasOwnProperty.call(value, 'value')

    //TODO the whole ctx need to check fully.
    const actionCtx: ActionContext = {
      store,
      currentPath: ctx.currentPath,
      pathModifiers: ctx.pathModifiers,
      validators: ctx.validators,
      translations: ctx.translations,
      defaultLanguage: ctx.defaultLanguage,
      activeLanguage: ctx.activeLanguage,
      componentProps: ctx.componentProps,
    }

    let handler = actions[actionName]

    if (!handler && actionName === 'set') {
      handler = createSetAction(store)
    }

    if (!handler) return undefined

    return async (e: unknown) => {
      const resolvedParams: Record<string, unknown> = { ...ctx.componentProps, ...params }
      // Case 1: value from event (input onChange) – only when the model
      // did NOT define a value explicitly.
      if (!hasExplicitValue && e != null && typeof e === 'object' && 'target' in e) {
        const target = (e as { target?: { value?: unknown } }).target
        if (target?.value !== undefined) resolvedParams.value = target.value
      }
      // Cases 2 & 3: static JSON value or nested $modifier value – both
      // flow through resolveModifier below and are preserved.
      for (const [k, v] of Object.entries(resolvedParams)) {
        resolvedParams[k] = await resolveModifier(v, modifiers, actionCtx)
      }
      const result = handler(resolvedParams, actionCtx)
      if (result instanceof Promise) await result

      // Run validations for this store/path if configured
      const storeName = resolvedParams.store as string | undefined
      const rawPath = resolvedParams.path as string | undefined
      if (actionCtx.validators && storeName && rawPath) {
        // Resolve to logical path so validations work with lists, pathModifiers,
        // and relative paths (e.g. "score" inside /players/0).
        const logicalPath = resolveStorePath(rawPath, actionCtx.currentPath, actionCtx.pathModifiers, storeName)
        runValidationsForPath(actionCtx.validators, store, storeName, logicalPath)
      }
    }
  }
  return undefined
}
