import { hasAnyError, hasAnyTouched } from '../util/helpers'
import { JSONParams } from '../util/types'

export const isNotTouchedOrHasError = (params: JSONParams): boolean => {
  const { error, touched } = params as {
    error?: unknown
    touched?: unknown
  }
  const hasError = hasAnyError(error)
  const isTouched = hasAnyTouched(touched)
  return !isTouched || hasError
}
