import React from 'react'

export const Button = ({ children, onPress, onClick, style, disabled, ...rest }: Record<string, unknown>) => {
  return (
    <button
      style={{
        ...(style as React.CSSProperties),
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
      onClick={(onPress ?? onClick) as React.MouseEventHandler<HTMLButtonElement>}
      {...rest}
    >
      {children as React.ReactNode}
    </button>
  )
}
