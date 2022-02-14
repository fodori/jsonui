import { getStateValue as getStateValueSelector } from '../store/root/selectors'
import { set as setAction } from '../store/root/actions'
import { JsonUIFunctionType } from './appRootFunctions'
import { PathModifiersType } from '../utils/types'

const getStateValue: JsonUIFunctionType = (attr, { currentPaths } = {}, callerArgs, stock) => {
  const { store, path } = attr
  const state = stock.reduxStore.getState()
  return getStateValueSelector(state, { store, path }, currentPaths as PathModifiersType)
}
const get: JsonUIFunctionType = (attr, { currentPaths } = {}, callerArgs, stock) => {
  const { store, path } = attr
  const state = stock.reduxStore.getState()
  return getStateValueSelector(state, { store, path }, currentPaths as PathModifiersType)
}
const set: JsonUIFunctionType = (attr, props, callerArgs, stock) => {
  stock.reduxStore.dispatch(
    setAction({ ...attr, value: attr && attr.value !== undefined ? attr.value : callerArgs[0], currentPaths: props.currentPaths, stock })
  )
}
export default {
  getStateValue,
  get,
  set,
}
