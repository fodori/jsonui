import React from 'react'
import { appRootFunctions } from '@jsonui/core'
import { ViewerProps } from 'types'
import stockInitBasic from './stock/stockToRenderer'
import ReduxProviders from './ReduxProviders'
import Renderer from './Renderer'
import ErrorBoundary from './ErrorBoundary'

function Viewer({ model, components, functions }: ViewerProps) {
  const stockInit = {
    components: { ...stockInitBasic.components, ...components },
    functions: {
      ...stockInitBasic.functions,
      ...appRootFunctions,
      ...functions,
    },
  }

  return <Renderer model={model} stockInit={stockInit} />
}

function ViewerWeb({ defaultValues, ...props }: ViewerProps) {
  return (
    <ErrorBoundary type="viewer">
      <ReduxProviders defaultValues={defaultValues}>
        <Viewer {...props} />
      </ReduxProviders>
    </ErrorBoundary>
  )
}

export default ViewerWeb
