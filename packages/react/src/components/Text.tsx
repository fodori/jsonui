import React from 'react'

export function Text({ children, style, ...rest }: Record<string, unknown>) {
  return (
    <p style={style as React.CSSProperties} {...rest}>
      {children as React.ReactNode}
    </p>
  )
}
