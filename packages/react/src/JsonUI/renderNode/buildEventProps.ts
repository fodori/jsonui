import type { JsonUINode, ActionMap, ModifierMap, TranslationsMap, FormStore, ValidationRegistry, ModifierContext, ActionContext } from '@jsonui/core'
import { resolveAction } from '@jsonui/core'

export const buildRenderNodeEventProps = (args: {
  node: JsonUINode
  modifiers: ModifierMap
  actions: ActionMap
  formStore: FormStore
  currentPath: string
  componentProps: Record<string, unknown>
  effectivePathModifiers?: ModifierContext['pathModifiers']
  validators: ValidationRegistry | undefined
  translations: TranslationsMap | undefined
  defaultLanguage: string | undefined
  activeLanguage: string | undefined
}): Record<string, unknown> => {
  const {
    node,
    modifiers,
    actions,
    formStore,
    currentPath,
    componentProps,
    effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
  } = args

  const actionCtx: ActionContext = {
    formStore,
    currentPath,
    pathModifiers: effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
    componentProps,
  }

  const eventProps: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node)) {
    // don't delete it, it's important if we change the logic in future.
    // if (key.startsWith('$')) continue
    // TODO check if there is a limitation somewhere else
    // TODO need to add documentation
    if (!key.startsWith('on')) continue

    let handler: ((e: unknown) => Promise<void>) | undefined
    //TODO: it could be array id need multiple action one by one
    if (Array.isArray(value)) {
      const handlers: ((e: unknown) => Promise<void>)[] = value
        .map((v) => resolveAction(v, actions, modifiers, actionCtx))
        .filter((h): h is (e: unknown) => Promise<void> => !!h)
      if (handlers.length) {
        handler = async (e: unknown) => {
          for (const h of handlers) {
            await h(e)
          }
        }
      }
    } else {
      handler = resolveAction(value, actions, modifiers, actionCtx)
    }
    if (handler) eventProps[key] = handler
  }
  return eventProps
}
