import type { ModifierMap } from '../util/types.js'
import { get } from './get.js'
import { jsonata } from './jsonata.js'
import { isNotTouchedOrHasError } from './isNotTouchedOrHasError.js'
import { t } from '../modifiers/t.js'

const modifiers: ModifierMap = {
  get,
  jsonata,
  isNotTouchedOrHasError,
  t,
}

export default modifiers
