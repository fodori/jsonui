import type { JsonUINode, ActionMap, ModifierMap, TranslationsMap, Store, ValidationRegistry } from '@jsonui/core'
import { resolveAction } from '@jsonui/core'

export function buildRenderNodeEventProps(args: {
  effectiveNode: JsonUINode
  modifiers: ModifierMap
  actions: ActionMap
  store: Store
  currentPath: string
  componentProps: Record<string, unknown>
  effectivePathModifiers: Record<string, { path: string }> | undefined
  validators: ValidationRegistry | undefined
  translations: TranslationsMap | undefined
  defaultLanguage: string | undefined
  activeLanguage: string | undefined
}): Record<string, unknown> {
  const {
    effectiveNode,
    modifiers,
    actions,
    store,
    currentPath,
    componentProps,
    effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
  } = args

  const actionCtx = {
    store,
    currentPath,
    pathModifiers: effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    componentProps,
  }

  const eventProps: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(effectiveNode)) {
    if (key.startsWith('$')) continue
    // TODO check if there is a limitation somewhere else
    // TODO need to add documentation
    if (!key.startsWith('on')) continue

    let handler: ((e: unknown) => Promise<void>) | undefined
    //TODO: it could be array id need multiple action one by one
    if (Array.isArray(value)) {
      const handlers: ((e: unknown) => Promise<void>)[] = value
        .map((v) => resolveAction(v, actions, modifiers, store, actionCtx))
        .filter((h): h is (e: unknown) => Promise<void> => !!h)
      if (handlers.length) {
        handler = async (e: unknown) => {
          for (const h of handlers) {
            await h(e)
          }
        }
      }
    } else {
      handler = resolveAction(value, actions, modifiers, store, actionCtx)
    }
    if (handler) eventProps[key] = handler
  }
  return eventProps
}
