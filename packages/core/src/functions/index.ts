import type { FunctionMap } from '../types.js'
import { get } from './get.js'
import { set } from './set.js'
import { submit, submitErrors, submitWithPayload } from './submit.js'
import { helloWorld } from './helloWorld.js'
import { jsonata } from './jsonata.js'
import { isNotTouchedOrHasError } from './isNotTouchedOrHasError.js'
import { t } from './t.js'

export const functions: FunctionMap = {
  get,
  set,
  submit,
  submitErrors,
  submitWithPayload,
  helloWorld,
  jsonata,
  isNotTouchedOrHasError,
  t,
}

export { hasAnyError, hasAnyTouched } from './helpers.js'
export { get } from './get.js'
export { set } from './set.js'
export { submit, submitErrors, submitWithPayload } from './submit.js'
export { helloWorld } from './helloWorld.js'
export { jsonata } from './jsonata.js'
export { isNotTouchedOrHasError } from './isNotTouchedOrHasError.js'
export { t } from './t.js'
