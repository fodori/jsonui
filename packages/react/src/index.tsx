import React from 'react'
import { ChangeDefaultValueFuncProp, JSONValue, ViewerProps } from 'types'
import ViewerWeb from './ViewerWeb'
import { MessageHandlerContext, MessageHandler } from './MessageReceiverContext'

type JsonUIProps = ViewerProps

const JsonUI = (props: JsonUIProps) => <ViewerWeb {...props} />

export { JsonUI, MessageHandlerContext, MessageHandler }
export type { JsonUIProps, JSONValue, ChangeDefaultValueFuncProp }
