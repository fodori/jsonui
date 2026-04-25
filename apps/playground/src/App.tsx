import { JsonUI, builtinComponents, ErrorBoundary } from '@jsonui/react'
import { modifiers, actions } from '@jsonui/core'
import type { JsonUINode, JSONObject } from '@jsonui/core'
import modelJson from './models/example-nested-modifiers.json'
import defaultValuesJson from './models/example-nested-defaultValues.json'

const model = modelJson as JsonUINode
const defaultValues = defaultValuesJson as Record<string, JSONObject>

export function App() {
  return (
    <ErrorBoundary>
      <JsonUI model={model} components={builtinComponents} modifiers={modifiers} actions={actions} defaultValues={defaultValues} defaultLanguage="en" activeLanguage="hu" />
    </ErrorBoundary>
  )
}
