import React from 'react'
import { appRootFunctions, constants as c } from '@jsonui/core'
import EStyleSheet from 'react-native-extended-stylesheet'
import stockInitBasic from './stock/stockToRenderer'
import ReduxProviders from './ReduxProviders'
import Renderer from './Renderer'
import ErrorBoundary from './ErrorBoundary'

export interface ViewerProps {
  viewDef: any
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
  try {
    EStyleSheet.clearCache()
    // TODO: add a proper theme solution
    EStyleSheet.build({ $theme: 'light', $bgColor: 'white' })
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return <Renderer viewDef={viewDef} stockInit={stockInit} />
}

function ViewerWeb(props: ViewerProps) {
  return (
    <ErrorBoundary type="viewer">
      <ReduxProviders>
        <Viewer {...props} />
      </ReduxProviders>
    </ErrorBoundary>
  )
}

export default ViewerWeb
