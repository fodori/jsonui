import { createTransform } from 'redux-persist'
import pick from 'lodash/pick'
import * as c from '../utils/constants'

const SetTransform = createTransform(
  (inboundState, key) => {
    if (key !== 'root') return inboundState
    return pick(inboundState, c.PERSIST_STORAGE_NAMES)
  },
  (outboundState, key) => {
    if (key !== 'root') return outboundState
    return pick(outboundState, c.PERSIST_STORAGE_NAMES)
  }
)

export default {
  key: 'main',
  whitelist: ['root'],
  transforms: [SetTransform],
}
