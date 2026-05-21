import { JsonUINode } from '@jsonui/core'
import React from 'react'

export const Text = ({ children, style, ...rest }: JsonUINode) => {
  return (
    <p style={style as React.CSSProperties} {...rest}>
      {children as React.ReactNode}
    </p>
  )
}
