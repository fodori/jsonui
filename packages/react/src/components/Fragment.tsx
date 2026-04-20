import React from 'react'

export function Fragment({ children }: Record<string, unknown>) {
  return <>{children as React.ReactNode}</>
}
