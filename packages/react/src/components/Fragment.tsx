import { JsonUINode } from '@jsonui/core'
import React from 'react'

export const Fragment = ({ children }: JsonUINode) => {
  return <>{children as React.ReactNode}</>
}
