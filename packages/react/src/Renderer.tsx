import React, { createContext, useMemo } from 'react'
import { useStore } from 'react-redux'
import { constants as c, PathModifierContext, Stock, StockContext } from '@jsonui/core'
import { AnyAction, Store } from 'redux'
import MessageReceiver from './MessageReceiver'
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

  // Type assertion to handle React 19 typing issues
  const StockProvider = StockContext.Provider as any
  const PathModifierProvider = PathModifierContext.Provider as any

  if (model === undefined) {
    return null
  }
  return (
    <StockProvider value={stock}>
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <PathModifierProvider value={{}}>
        <MessageReceiver />
        <Wrapper props={model} />
      </PathModifierProvider>
    </StockProvider>
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
