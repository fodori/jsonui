import React from 'react'
import { JsonUIComponentsType, JsonUIFunctions, JsonUIFunctionType } from '@jsonui/core'
import { ChangeDefaultValueFuncProp, JSONValue, ViewerProps } from './types'
import ViewerWeb from './ViewerWeb'
import { MessageHandlerContext, MessageHandler } from './MessageReceiverContext'

const JsonUI = (props: ViewerProps) => <ViewerWeb {...props} />

export { JsonUI, MessageHandlerContext, MessageHandler }
export type { ViewerProps as JsonUIProps, JSONValue, ChangeDefaultValueFuncProp, JsonUIFunctions, JsonUIFunctionType, JsonUIComponentsType }
export { default as WrapperAsync } from './WrapperAsync'
export * from './hooks/useAsync'
export default JsonUI
