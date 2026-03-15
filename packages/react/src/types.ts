import { JsonUIComponentsType, JsonUIFunctions } from '@jsonui/core'

export type JSONPrimitive = string | number | boolean | null
export type JSONObject = { [member: string]: any } // any to avoid circular dependency
export type JSONArray = Array<any> // any to avoid circular dependency
export type JSONValue = JSONPrimitive | JSONObject | JSONArray | undefined // not perfect, typescript doesn't support it properly

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

export type FormID = string

export interface OnStateExportProps {
  id?: FormID
  formState: JSONValue
}

export type OnStateExportType = (arg: OnStateExportProps) => void

export interface ViewerProps {
  model: any
  defaultValues?: DefaultValues
  components?: JsonUIComponentsType
  functions?: JsonUIFunctions
  onStateExport?: OnStateExportType
  id?: string
}
