import React, { useMemo } from 'react'
import { useStore } from 'react-redux'
import { StockContext, PathModifierContext, wrapperUtil } from '@jsonui/core'
import { AnyAction, Store } from 'redux'
import { getStock } from './stock/stockToRenderer'
import Wrapper from './Wrapper'
import ErrorBoundary from './ErrorBoundary'

interface RendererProps {
  viewDef: any
  stockInit: any
  reduxStore: Store<any, AnyAction>
}

const Renderer = ({ viewDef, stockInit, reduxStore }: RendererProps) => {
  const stock = useMemo(() => getStock(stockInit, viewDef, Wrapper, reduxStore), [stockInit, viewDef, reduxStore])

  if (viewDef === undefined) {
    return null
  }
  return (
    <StockContext.Provider value={stock as any}>
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <PathModifierContext.Provider value={{}}>
        <Wrapper {...wrapperUtil.getWrapperProps(viewDef)} />
      </PathModifierContext.Provider>
    </StockContext.Provider>
  )
}

interface RendererFuncProps {
  viewDef: any
  stockInit: any
}

const rendererFunc = (props: RendererFuncProps) => {
  const reduxStore = useStore()

  return (
    <ErrorBoundary type="rendererFunc">
      <Renderer {...props} reduxStore={reduxStore} />
    </ErrorBoundary>
  )
}

export default rendererFunc
