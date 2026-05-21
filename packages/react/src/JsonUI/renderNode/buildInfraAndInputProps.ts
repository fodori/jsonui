import {
  MODIFIER_KEY,
  ERROR_STORE_SUFFIX,
  type JsonUINode,
  type ActionMap,
  type ModifierMap,
  type FormStore,
  type ModifierContext,
  JSONParams,
} from '@jsonui/core'

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
}: BuildInfraPropsArgs): JsonUINode => {
  const infraProps: JsonUINode = {}
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
  mergedProps: JsonUINode
}

export const applyInputErrorFromValueBinding = ({ compName, node, formStore, mergedProps }: ApplyInputErrorArgs): void => {
  if (compName !== 'Edit') return

  const valueSpec = node.value
  if (!valueSpec || typeof valueSpec !== 'object' || !(MODIFIER_KEY in valueSpec) || (valueSpec as JSONParams)[MODIFIER_KEY] !== 'get') {
    return
  }

  const storeName = (valueSpec as JSONParams).store as string | undefined
  const valuePath = (valueSpec as JSONParams).path as string | undefined
  if (!storeName || !valuePath) return

  const errorValue = formStore.getForStore(`${storeName}${ERROR_STORE_SUFFIX}`, valuePath)
  if (errorValue !== undefined) {
    mergedProps.error = errorValue
  }
}
