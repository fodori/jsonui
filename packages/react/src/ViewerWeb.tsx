import React from 'react'
import { appRootFunctions } from '@jsonui/core'
import stockInitBasic from './stock/stockToRenderer'
import ReduxProviders from './ReduxProviders'
import Renderer from './Renderer'
import ErrorBoundary from './ErrorBoundary'

export interface DefaultValues {
  [key: string]: Record<string, object>
}

export interface ViewerProps {
  viewDef: any
  defaultValues?: DefaultValues
  id?: string
  components?: any
  functions?: any
}

function Viewer({ viewDef, components, functions }: ViewerProps) {
  const stockInit = {
    components: { ...stockInitBasic.components, ...components },
    functions: {
      ...stockInitBasic.functions,
      ...appRootFunctions,
      ...functions,
    },
  }

  return <Renderer viewDef={viewDef} stockInit={stockInit} />
}

function ViewerWeb(props: ViewerProps) {
  return (
    <ErrorBoundary type="viewer">
      <ReduxProviders defaultValues={props.defaultValues}>
        <Viewer {...props} />
      </ReduxProviders>
    </ErrorBoundary>
  )
}

export default ViewerWeb
