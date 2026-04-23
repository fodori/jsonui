import React, { useEffect, useState } from 'react'
import { type Store, getRootStore } from '@jsonui/core'

export function SubmitButton(props: Record<string, unknown>) {
  const {
    children,
    style,
    store,
    path,
    fieldErrors,
    fieldTouched,
    error,
    touched,
    // internal context from RenderNode:
    stores,
    functions,
    currentPath,
    pathModifiers,
    onClick,
    value,
    ...rest
  } = props
  console.log('SubmitButton props', props)
  // const storeName = store as string | undefined
  // const allStores: Record<string, Store> = stores !== undefined && stores !== null ? (stores as Record<string, Store>) : {}

  // const root = getRootStore(allStores)

  // Subscribe to any store update so we re-render and re-read value/error/touched.
  // RenderNode doesn't collect deps for static store/path props, so without this
  // the button would never update. Using subscribe() (not only subscribeChange)
  // ensures we see every set() including .touch and .error writes.
  // const [, setTick] = useState(0)
  // useEffect(() => {
  //   if (!storeName || typeof root.subscribe !== 'function') return
  //   return root.subscribe(() => setTick((n) => n + 1))
  // }, [root, storeName])

  const disabled = !fieldTouched || !!fieldErrors

  return (
    <button
      style={{
        ...(style as React.CSSProperties),
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
      disabled={disabled}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      onClick={onClick as any}
      {...rest}
    >
      {children as React.ReactNode}
    </button>
  )
}
