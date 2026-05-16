import { MODIFIER_KEY, ERROR_STORE_SUFFIX, type JsonUINode, type ActionMap, type ModifierMap, type FormStore, type ModifierContext } from '@jsonui/core'

interface BuildInfraPropsArgs {
  compName: string
  formStore: FormStore
  modifiers: ModifierMap
  actions: ActionMap
  currentPath: string
  effectivePathModifiers?: ModifierContext['pathModifiers']
}

export const buildInfraPropsForComponent = ({
  compName,
  formStore,
  modifiers,
  actions,
  currentPath,
  effectivePathModifiers,
}: BuildInfraPropsArgs): Record<string, unknown> => {
  const infraProps: Record<string, unknown> = {}
  if (compName === 'SubmitButton') {
    infraProps.formStore = formStore
    infraProps.modifiers = modifiers
    infraProps.actions = actions
    infraProps.currentPath = currentPath
    infraProps.pathModifiers = effectivePathModifiers
  }
  return infraProps
}

interface ApplyInputErrorArgs {
  compName: string
  node: JsonUINode
  formStore: FormStore
  mergedProps: Record<string, unknown>
}

export const applyInputErrorFromValueBinding = ({ compName, node, formStore, mergedProps }: ApplyInputErrorArgs): void => {
  if (compName !== 'Edit') return

  const valueSpec = (node as Record<string, unknown>).value
  if (!valueSpec || typeof valueSpec !== 'object' || !(MODIFIER_KEY in valueSpec) || (valueSpec as Record<string, unknown>)[MODIFIER_KEY] !== 'get') {
    return
  }

  const storeName = (valueSpec as Record<string, unknown>).store as string | undefined
  const valuePath = (valueSpec as Record<string, unknown>).path as string | undefined
  if (!storeName || !valuePath) return

  const errorValue = formStore.getForStore(`${storeName}${ERROR_STORE_SUFFIX}`, valuePath)
  if (errorValue !== undefined) {
    mergedProps.error = errorValue
  }
}
