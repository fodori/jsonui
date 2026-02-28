import React from 'react'
import { ViewerProps } from 'types'
import stockInitBasic from './stock/stockToRenderer'
import ReduxProviders from './ReduxProviders'
import Renderer from './Renderer'
import ErrorBoundary from './ErrorBoundary'

function Viewer({ components, functions, ...props }: ViewerProps) {
  const stockInit = {
    components: { ...stockInitBasic.components, ...components },
    functions: {
      ...stockInitBasic.functions,
      ...functions,
    },
  }

  return <Renderer {...props} stockInit={stockInit} />
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
