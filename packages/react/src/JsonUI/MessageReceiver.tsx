import { useContext, useEffect } from 'react'
import { normalizePath, type FormStore } from '@jsonui/core'
import { MessageHandlerContext, type ChangeDefaultValueFunc } from './MessageReceiverContext.js'

const normalizeLogicalPath = (path: string): string => {
  const p = path.trim()
  if (!p || p === '/') return '/'
  const withSlash = p.startsWith('/') ? p : `/${p}`
  return normalizePath(withSlash)
}

/**
 * Subscribes the root store setter to `MessageHandler` (main JsonUI parity).
 */
export const MessageReceiver = ({ formStore }: { formStore: FormStore }) => {
  const messageHandler = useContext(MessageHandlerContext)

  useEffect(() => {
    const changeDefaultValue: ChangeDefaultValueFunc = ({ store: storeName, path, value }) => {
      const logicalPath = normalizeLogicalPath(path)
      // Match main DATA_UPDATE: do not mark field touched for host-driven updates.
      formStore.setForStore(storeName, logicalPath, value, false)
    }
    messageHandler?.set(changeDefaultValue)
  }, [messageHandler, formStore])

  return null
}
