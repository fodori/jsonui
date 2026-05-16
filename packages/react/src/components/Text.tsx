import React from 'react'

export const Text = ({ children, style, ...rest }: Record<string, unknown>) => {
  return (
    <p style={style as React.CSSProperties} {...rest}>
      {children as React.ReactNode}
    </p>
  )
}
