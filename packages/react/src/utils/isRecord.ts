import { JSONParams } from '@jsonui/core'

export const isRecord = (value: unknown): value is JSONParams => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
