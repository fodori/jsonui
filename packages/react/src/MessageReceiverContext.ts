import { createContext } from 'react'
import { ChangeDefaultValueFunc } from 'types'

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
