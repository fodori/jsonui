import {
  MODIFIER_KEY,
  ERROR_STORE_SUFFIX,
  type JsonUINode,
  type ActionMap,
  type ModifierMap,
  type FormStore,
  type ModifierContext,
  type ComponentContext,
  JSONParams,
} from '@jsonui/core'

interface BuildComponentContextArgs {
  formStore: FormStore
  modifiers: ModifierMap
  actions: ActionMap
  currentPath: string
  effectivePathModifiers?: ModifierContext['pathModifiers']
  fieldErrors?: unknown
  fieldTouched?: unknown
}

export const buildComponentContext = ({
  formStore,
  modifiers,
  actions,
  currentPath,
  effectivePathModifiers,
  fieldErrors,
  fieldTouched,
}: BuildComponentContextArgs): ComponentContext => {
  const ctx: ComponentContext = {
    actions,
    currentPath,
    formStore,
    modifiers,
    pathModifiers: effectivePathModifiers,
  }
  if (fieldErrors !== undefined) ctx.fieldErrors = fieldErrors
  if (fieldTouched !== undefined) ctx.fieldTouched = fieldTouched
  return ctx
}

interface ResolveExplicitFieldErrorsArgs {
  node: JsonUINode
  formStore: FormStore
}

const hasAnyError = (value: unknown): boolean => {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) return value.some((v) => hasAnyError(v))
  if (typeof value === 'object') return Object.values(value).some((v) => hasAnyError(v))
  return true
}

export const resolveExplicitFieldErrors = ({ node, formStore }: ResolveExplicitFieldErrorsArgs): unknown => {
  const valueSpec = node.value
  if (!valueSpec || typeof valueSpec !== 'object' || !(MODIFIER_KEY in valueSpec) || (valueSpec as JSONParams)[MODIFIER_KEY] !== 'get') {
    return undefined
  }

  const storeName = (valueSpec as JSONParams).store as string | undefined
  const valuePath = (valueSpec as JSONParams).path as string | undefined
  if (!storeName || !valuePath) return undefined

  const errorValue = formStore.getForStore(`${storeName}${ERROR_STORE_SUFFIX}`, valuePath)
  return hasAnyError(errorValue) ? errorValue : undefined
}
