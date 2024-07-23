import { getStateValue } from '../store/root/selectors'
import { set as setAction } from '../store/root/actions'
import { JsonUIFunctionType, PathModifiersType } from '../utils/types'
import * as c from '../utils/constants'

const get: JsonUIFunctionType = (attr, { [c.CURRENT_PATH_NAME]: currentPaths } = {}, callerArgs, stock) => {
  const { store, path, type, jsonataDef } = attr
  const state = stock.reduxStore.getState()
  return getStateValue(state, { store, path, type, jsonataDef }, currentPaths as PathModifiersType)
}
const set: JsonUIFunctionType = (attr, props, callerArgs, stock) => {
  stock.reduxStore.dispatch(
    setAction({ ...attr, value: attr && attr.value !== undefined ? attr.value : callerArgs[0], [c.CURRENT_PATH_NAME]: props[c.CURRENT_PATH_NAME], stock })
  )
}

const jsonata: JsonUIFunctionType = ({ jsonataDef, ...attr }) => {
  if (jsonataDef) {
    // console.log(' ---- jsonata ---- ')
    // console.log('jsonataDef: ', jsonataDef)
    // console.log('attr: ', attr)
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const jsonataObj = require('jsonata')
      const expression = jsonataObj(jsonataDef)
      const evaluate = expression.evaluate(attr)
      // console.log('evaluate: ', evaluate)
      return evaluate
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('jsonata error', error, jsonataDef)
    }
  }
  return null
}
export default {
  get,
  set,
  jsonata,
}
