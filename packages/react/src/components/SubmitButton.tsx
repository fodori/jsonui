import { JsonUINode } from '@jsonui/core'
import React from 'react'

export const SubmitButton = ({ children, style, $ctx, onClick, ...rest }: JsonUINode) => {
  const { fieldErrors, fieldTouched } = $ctx ?? {}

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
