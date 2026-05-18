import React from 'react'
import { MODIFIER_KEY } from '@jsonui/core'

export const coercePrimitiveChild = (value: unknown): React.ReactNode => {
  if (value === true) return 'true'
  if (value === false) return 'false'
  if (value === null) return 'null'
  if (value === undefined) return undefined
  if (React.isValidElement(value)) return value
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (MODIFIER_KEY in obj) {
      return undefined
    }
    try {
      return JSON.stringify(value)
    } catch {
      return '[invalid]'
    }
  }
  return value as React.ReactNode
}
