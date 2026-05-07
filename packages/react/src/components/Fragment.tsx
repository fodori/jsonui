import React from 'react'

export const Fragment = ({ children }: Record<string, unknown>) => {
  return <>{children as React.ReactNode}</>
}
