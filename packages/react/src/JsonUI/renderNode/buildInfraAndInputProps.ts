import { MODIFIER_KEY, ERROR_STORE_SUFFIX, type JsonUINode, type ActionMap, type ModifierMap, type Store, type ModifierContext } from '@jsonui/core'

export function buildInfraPropsForComponent(args: {
  compName: string
  store: Store
  modifiers: ModifierMap
  actions: ActionMap
  currentPath: string
  effectivePathModifiers?: ModifierContext['pathModifiers']
}): Record<string, unknown> {
  const { compName, store, modifiers, actions, currentPath, effectivePathModifiers } = args
  const infraProps: Record<string, unknown> = {}
  if (compName === 'SubmitButton') {
    infraProps.store = store
    infraProps.modifiers = modifiers
    infraProps.actions = actions
    infraProps.currentPath = currentPath
    infraProps.pathModifiers = effectivePathModifiers
  }
  return infraProps
}

export function applyInputErrorFromValueBinding(args: { compName: string; node: JsonUINode; store: Store; mergedProps: Record<string, unknown> }): void {
  const { compName, node, store, mergedProps } = args
  if (compName !== 'Edit') return

  const valueSpec = (node as Record<string, unknown>).value
  if (!valueSpec || typeof valueSpec !== 'object' || !(MODIFIER_KEY in valueSpec) || (valueSpec as Record<string, unknown>)[MODIFIER_KEY] !== 'get') {
    return
  }

  const storeName = (valueSpec as Record<string, unknown>).store as string | undefined
  const valuePath = (valueSpec as Record<string, unknown>).path as string | undefined
  if (!storeName || !valuePath) return

  const errorValue = store.getForStore(`${storeName}${ERROR_STORE_SUFFIX}`, valuePath)
  if (errorValue !== undefined) {
    mergedProps.error = errorValue
  }
}
