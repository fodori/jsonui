import React, { useEffect, useState } from 'react'
import {
  type Store,
  getRootStore,
  resolveStorePath,
  type ModifierContext,
  type FunctionMap,
  type FunctionHandler,
  ERROR_STORE_SUFFIX,
  TOUCH_STORE_SUFFIX,
} from '@jsonui/core'

function hasAnyError(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) {
    return value.some((v) => hasAnyError(v))
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((v) => hasAnyError(v))
  }
  return true
}

function hasAnyTouched(value: unknown): boolean {
  if (value === true) return true
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) {
    return value.some((v) => hasAnyTouched(v))
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((v) => hasAnyTouched(v))
  }
  return false
}

export function SubmitButton(props: Record<string, unknown>) {
  const {
    children,
    style,
    store,
    path,
    // internal context from RenderNode:
    stores,
    functions,
    currentPath,
    pathModifiers,
    ...rest
  } = props

  const storeName = store as string | undefined
  const pathStr = path as string | undefined
  const allStores = (stores as Record<string, Store>) ?? {}

  const root = getRootStore(allStores)

  // Resolve logical path the same way as get/set actions, including
  // support for relative paths and $pathModifiers / list context.
  const logicalPath =
    storeName && pathStr
      ? resolveStorePath(pathStr, (currentPath as string | undefined) ?? '/', pathModifiers as Record<string, { path: string }> | undefined, storeName)
      : '/'

  // Subscribe to any store update so we re-render and re-read value/error/touched.
  // RenderNode doesn't collect deps for static store/path props, so without this
  // the button would never update. Using subscribe() (not only subscribeChange)
  // ensures we see every set() including .touch and .error writes.
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!storeName || typeof root.subscribe !== 'function') return
    return root.subscribe(() => setTick((n) => n + 1))
  }, [root, storeName])

  const value = storeName && logicalPath ? root.getForStore(storeName, logicalPath) : undefined
  const errorTree = storeName && logicalPath ? root.getForStore(`${storeName}${ERROR_STORE_SUFFIX}`, logicalPath) : undefined
  const touchedTree = storeName && logicalPath ? root.getForStore(`${storeName}${TOUCH_STORE_SUFFIX}`, logicalPath) : undefined

  const hasError = hasAnyError(errorTree)
  const isTouched = hasAnyTouched(touchedTree)
  const disabled = !isTouched || hasError

  const fnMap = (functions ?? {}) as FunctionMap
  const submitFn = fnMap.submit as FunctionHandler | undefined

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    if (disabled || !submitFn || !storeName) return

    void (async () => {
      const ctx: ModifierContext = {
        stores: allStores,
        currentPath: logicalPath,
        pathModifiers: pathModifiers as Record<string, { path: string }> | undefined,
        validators: undefined,
        translations: undefined,
        defaultLanguage: 'en',
        activeLanguage: 'en',
      }

      const result = submitFn(
        {
          store: storeName,
          path: logicalPath,
          value,
        },
        ctx
      )
      if (result instanceof Promise) {
        await result
      }
    })()
  }

  return (
    <button
      style={{
        ...(style as React.CSSProperties),
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      {children as React.ReactNode}
    </button>
  )
}
