import type { JsonUINode, FunctionMap, TranslationsMap, Store, ValidationRegistry } from '@jsonui/core'
import { resolveAction } from '@jsonui/core'

export function buildRenderNodeEventProps(args: {
  effectiveNode: JsonUINode
  functions: FunctionMap
  stores: Record<string, Store>
  currentPath: string
  effectivePathModifiers: Record<string, { path: string }> | undefined
  validators: ValidationRegistry | undefined
  translations: TranslationsMap | undefined
  defaultLanguage: string | undefined
  activeLanguage: string | undefined
}): Record<string, unknown> {
  const { effectiveNode, functions, stores, currentPath, effectivePathModifiers, validators, translations, defaultLanguage, activeLanguage } = args

  const actionCtx = {
    currentPath,
    pathModifiers: effectivePathModifiers,
    validators,
    translations,
    defaultLanguage,
    activeLanguage,
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
        .map((v) => resolveAction(v, functions, stores, actionCtx))
        .filter((h): h is (e: unknown) => Promise<void> => !!h)
      if (handlers.length) {
        handler = async (e: unknown) => {
          for (const h of handlers) {
            await h(e)
          }
        }
      }
    } else {
      handler = resolveAction(value, functions, stores, actionCtx)
    }
    if (handler) eventProps[key] = handler
  }
  return eventProps
}
