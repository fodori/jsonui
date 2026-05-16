import React from 'react'

export const View = ({ children, style, ...rest }: Record<string, unknown>) => {
  return (
    <div style={style as React.CSSProperties} {...rest}>
      {children as React.ReactNode}
    </div>
  )
}
