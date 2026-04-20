import { createContext } from 'react'
import type { JSONValue } from '@jsonui/core'

export interface ChangeDefaultValueFuncProp {
  store: string
  path: string
  value: JSONValue
}

export type ChangeDefaultValueFunc = (arg: ChangeDefaultValueFuncProp) => void

/** Main JsonUI parity: host registers a callback; JsonUI wires store updates into it. */
export class MessageHandler {
  updateDefaultValueHandler?: ChangeDefaultValueFunc

  set = (newFunc: ChangeDefaultValueFunc) => {
    this.updateDefaultValueHandler = newFunc
  }

  get = (): ChangeDefaultValueFunc | undefined => {
    return this.updateDefaultValueHandler
  }
}

export const MessageHandlerContext = createContext<MessageHandler | null>(null)
