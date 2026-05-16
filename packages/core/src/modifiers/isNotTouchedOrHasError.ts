import { hasAnyError, hasAnyTouched } from '../util/helpers'

export const isNotTouchedOrHasError = (params: Record<string, unknown>): boolean => {
  const { error, touched } = params as {
    error?: unknown
    touched?: unknown
  }
  const hasError = hasAnyError(error)
  const isTouched = hasAnyTouched(touched)
  return !isTouched || hasError
}
