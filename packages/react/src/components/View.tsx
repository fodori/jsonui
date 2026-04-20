import React from 'react'

export function View({ children, style, ...rest }: Record<string, unknown>) {
  return (
    <div style={style as React.CSSProperties} {...rest}>
      {children as React.ReactNode}
    </div>
  )
}
