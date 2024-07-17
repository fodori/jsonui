import { getStateValue as getStateValueSelector } from '../store/root/selectors'
import { set as setAction } from '../store/root/actions'
import { JsonUIFunctionType } from './appRootFunctions'
import { PathModifiersType } from '../utils/types'
import * as c from '../utils/constants'

const getStateValue: JsonUIFunctionType = (attr, { [c.CURRENT_PATH_NAME]: currentPaths } = {}, callerArgs, stock) => {
  const { store, path, type } = attr
  const state = stock.reduxStore.getState()
  return getStateValueSelector(state, { store, path, type }, currentPaths as PathModifiersType)
}
const get: JsonUIFunctionType = (attr, { [c.CURRENT_PATH_NAME]: currentPaths } = {}, callerArgs, stock) => {
  const { store, path, type } = attr
  const state = stock.reduxStore.getState()
  return getStateValueSelector(state, { store, path, type }, currentPaths as PathModifiersType)
}
const set: JsonUIFunctionType = (attr, props, callerArgs, stock) => {
  stock.reduxStore.dispatch(
    setAction({ ...attr, value: attr && attr.value !== undefined ? attr.value : callerArgs[0], [c.CURRENT_PATH_NAME]: props[c.CURRENT_PATH_NAME], stock })
  )
}
export default {
  getStateValue,
  get,
  set,
}
