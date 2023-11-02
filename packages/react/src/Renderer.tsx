import React, { useMemo } from 'react'
import { useStore } from 'react-redux'
import { StockContext, PathModifierContext, constants as c } from '@jsonui/core'
import { AnyAction, Store } from 'redux'
import { getStock } from './stock/stockToRenderer'
import Wrapper from './Wrapper'
import ErrorBoundary from './ErrorBoundary'

interface RendererProps {
  model: any
  stockInit: any
  reduxStore: Store<any, AnyAction>
}

const Renderer = ({ model, stockInit, reduxStore }: RendererProps) => {
  const stock = useMemo(() => getStock(stockInit, model, Wrapper, reduxStore), [stockInit, model, reduxStore])

  if (model === undefined) {
    return null
  }
  return (
    <StockContext.Provider value={stock as any}>
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <PathModifierContext.Provider value={{}}>
        <Wrapper props={model} />
      </PathModifierContext.Provider>
    </StockContext.Provider>
  )
}

interface RendererFuncProps {
  model: any
  stockInit: any
}

const rendererFunc = (props: RendererFuncProps) => {
  // TODO remove this and merge to Renderer
  const reduxStore = useStore()

  return (
    <ErrorBoundary type="rendererFunc">
      <Renderer {...props} reduxStore={reduxStore} />
    </ErrorBoundary>
  )
}

export default rendererFunc
