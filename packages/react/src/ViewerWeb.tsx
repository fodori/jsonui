import React from 'react'
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
      ...functions,
    },
  }

  return <Renderer model={model} stockInit={stockInit} />
}

function ViewerWeb({ defaultValues, getFormState, ...props }: ViewerProps) {
  return (
    <ErrorBoundary type="viewer">
      <ReduxProviders defaultValues={defaultValues} getFormState={getFormState}>
        <Viewer {...props} />
      </ReduxProviders>
    </ErrorBoundary>
  )
}

export default ViewerWeb
