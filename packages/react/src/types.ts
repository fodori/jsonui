import { JsonUIComponentsType, JsonUIFunctions } from '@jsonui/core'

export type JSONPrimitive = string | number | boolean | null
// eslint-disable-next-line no-use-before-define
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue }
export type JSONArray = Array<JSONValue>

export interface ChangeDefaultValueFuncProp {
  store: string
  path: string
  value: JSONValue
}
export type ChangeDefaultValueFunc = (arg: ChangeDefaultValueFuncProp) => void
export type OnSubmitFunc = (arg: any) => void

export interface DefaultValues {
  [key: string]: JSONValue
}
export type GetFormState = React.MutableRefObject<(() => DefaultValues) | undefined>

export interface ViewerProps {
  model: any
  defaultValues?: DefaultValues
  components?: JsonUIComponentsType
  functions?: JsonUIFunctions
  getFormState?: GetFormState
}
