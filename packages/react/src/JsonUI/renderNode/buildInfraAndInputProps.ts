import { getRootStore, MODIFIER_KEY, ERROR_STORE_SUFFIX, type JsonUINode, type ActionMap, type ModifierMap, type Store } from '@jsonui/core'

export function buildInfraPropsForComponent(args: {
  compName: string
  stores: Record<string, Store>
  modifiers: ModifierMap
  actions: ActionMap
  currentPath: string
  effectivePathModifiers: Record<string, { path: string }> | undefined
}): Record<string, unknown> {
  const { compName, stores, modifiers, actions, currentPath, effectivePathModifiers } = args
  const infraProps: Record<string, unknown> = {}
  if (compName === 'SubmitButton') {
    infraProps.stores = stores
    infraProps.modifiers = modifiers
    infraProps.actions = actions
    infraProps.currentPath = currentPath
    infraProps.pathModifiers = effectivePathModifiers
  }
  return infraProps
}

export function applyInputErrorFromValueBinding(args: {
  compName: string
  effectiveNode: JsonUINode
  stores: Record<string, Store>
  mergedProps: Record<string, unknown>
}): void {
  const { compName, effectiveNode, stores, mergedProps } = args
  if (compName !== 'Edit') return

  const valueSpec = (effectiveNode as Record<string, unknown>).value
  if (!valueSpec || typeof valueSpec !== 'object' || !(MODIFIER_KEY in valueSpec) || (valueSpec as Record<string, unknown>)[MODIFIER_KEY] !== 'get') {
    return
  }

  const storeName = (valueSpec as Record<string, unknown>).store as string | undefined
  const valuePath = (valueSpec as Record<string, unknown>).path as string | undefined
  if (!storeName || !valuePath) return

  const root = getRootStore(stores)
  const errorValue = root.getForStore(`${storeName}${ERROR_STORE_SUFFIX}`, valuePath)
  if (errorValue !== undefined) {
    mergedProps.error = errorValue
  }
}
