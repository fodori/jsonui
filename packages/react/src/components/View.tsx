import { JsonUINode } from '@jsonui/core'
import React from 'react'

export const View = ({ children, style, ...rest }: JsonUINode) => {
  return (
    <div style={style as React.CSSProperties} {...rest}>
      {children as React.ReactNode}
    </div>
  )
}
