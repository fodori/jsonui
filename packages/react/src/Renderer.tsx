import React, { useEffect, useMemo, useRef } from 'react'
import { useStore } from 'react-redux'
import { PathModifierContext, StockContext } from '@jsonui/core'
import { AnyAction, Store } from 'redux'
import { DefaultValues, OnStateExportType } from 'types'
import MessageReceiver from './MessageReceiver'
import { getStock } from './stock/stockToRenderer'
import Wrapper from './Wrapper'
import ErrorBoundary from './ErrorBoundary'

interface RendererProps {
  model: any
  stockInit: any
  reduxStore: Store<any, AnyAction>
  onStateExport?: OnStateExportType
  defaultValues?: DefaultValues
  id?: string
}

const Renderer = ({ model, stockInit, reduxStore, onStateExport, defaultValues, id }: RendererProps) => {
  const stock = useMemo(() => getStock(stockInit, model, Wrapper, reduxStore), [stockInit, model, reduxStore])

  const idRef = useRef(id)
  if (model === undefined) {
    return null
  }

  const getCurrentFormState = () => {
    return stock?.reduxStore.getState()?.root
  }

  useEffect(() => {
    idRef.current = id
    return () => {
      if (onStateExport) {
        const defaultValue = getCurrentFormState()
        onStateExport({ id: idRef.current, defaultValue })
      }
    }
  }, [model, defaultValues, onStateExport, id])

  return (
    <StockContext.Provider value={stock}>
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <PathModifierContext.Provider value={{}}>
        <MessageReceiver />
        <Wrapper props={model} />
      </PathModifierContext.Provider>
    </StockContext.Provider>
  )
}

interface RendererFuncProps {
  model: any
  stockInit: any
  onStateExport?: OnStateExportType
  defaultValues?: DefaultValues
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
