import { useContext, useEffect } from 'react'
import { normalizePath, getRootStore, type Store } from '@jsonui/core'
import { MessageHandlerContext, type ChangeDefaultValueFunc } from './MessageReceiverContext.js'

function normalizeLogicalPath(path: string): string {
  const p = path.trim()
  if (!p || p === '/') return '/'
  const withSlash = p.startsWith('/') ? p : `/${p}`
  return normalizePath(withSlash)
}

/**
 * Subscribes the root store setter to `MessageHandler` (main JsonUI parity).
 */
export function MessageReceiver({ stores }: { stores: Record<string, Store> }) {
  const messageHandler = useContext(MessageHandlerContext)

  useEffect(() => {
    const root = getRootStore(stores)
    const changeDefaultValue: ChangeDefaultValueFunc = ({ store, path, value }) => {
      const logicalPath = normalizeLogicalPath(path)
      // Match main DATA_UPDATE: do not mark field touched for host-driven updates.
      root.setForStore(store, logicalPath, value, false)
    }
    messageHandler?.set(changeDefaultValue)
  }, [messageHandler, stores])

  return null
}
