import type { Store } from '../store.js'
import { resolveStorePath } from '../store.js'
import type { ActionHandler, ModifierContext, FunctionMap, TranslationsMap } from '../types.js'
import { ACTION_KEY } from '../types.js'
import { createSetAction } from './setAction.js'
import { resolveModifier } from './resolveModifier.js'
import { runValidationsForPath, type ValidationRegistry } from './validation.js'

export function resolveAction(
  value: unknown,
  functions: FunctionMap,
  stores: Record<string, Store>,
  ctx: {
    currentPath: string
    pathModifiers?: Record<string, { path: string }>
    validators?: ValidationRegistry
    translations?: TranslationsMap
    defaultLanguage?: string
    activeLanguage?: string
  }
): ((e: unknown) => Promise<void>) | undefined {
  if (value != null && typeof value === 'object' && ACTION_KEY in value) {
    const actionName = (value as Record<string, unknown>)[ACTION_KEY] as string
    const params = { ...(value as Record<string, unknown>) }
    delete params[ACTION_KEY]
    const hasExplicitValue = Object.prototype.hasOwnProperty.call(value, 'value')

    const modCtx: ModifierContext = {
      stores,
      currentPath: ctx.currentPath,
      pathModifiers: ctx.pathModifiers,
      validators: ctx.validators,
      translations: ctx.translations,
      defaultLanguage: ctx.defaultLanguage,
      activeLanguage: ctx.activeLanguage,
    }

    const fn = functions[actionName]
    let handler: ActionHandler | undefined = fn
      ? (p) => {
          const result = fn(p, modCtx)
          return result instanceof Promise ? result.then(() => undefined) : undefined
        }
      : undefined

    if (!handler && actionName === 'set') {
      handler = createSetAction(stores)
    }

    if (!handler) return undefined

    return async (e: unknown) => {
      const resolvedParams: Record<string, unknown> = { ...params }
      // Case 1: value from event (input onChange) – only when the model
      // did NOT define a value explicitly.
      if (!hasExplicitValue && e != null && typeof e === 'object' && 'target' in e) {
        const target = (e as { target?: { value?: unknown } }).target
        if (target?.value !== undefined) resolvedParams.value = target.value
      }
      // Cases 2 & 3: static JSON value or nested $modifier value – both
      // flow through resolveModifier below and are preserved.
      for (const [k, v] of Object.entries(resolvedParams)) {
        resolvedParams[k] = await resolveModifier(v, functions, modCtx)
      }
      const result = handler(resolvedParams, modCtx)
      if (result instanceof Promise) await result

      // Run validations for this store/path if configured
      const storeName = resolvedParams.store as string | undefined
      const rawPath = resolvedParams.path as string | undefined
      if (modCtx.validators && storeName && rawPath) {
        // Resolve to logical path so validations work with lists, pathModifiers,
        // and relative paths (e.g. "score" inside /players/0).
        const logicalPath = resolveStorePath(rawPath, modCtx.currentPath, modCtx.pathModifiers, storeName)
        runValidationsForPath(modCtx.validators, stores, storeName, logicalPath)
      }
    }
  }
  return undefined
}
