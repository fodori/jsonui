import * as c from '../../utils/constants'
import * as utils from '../../utils/jsonUtils'
import { PathModifiersType, ReduxPath, ReduxPathTypeEnum } from '../../utils/types'
import { RootStateType } from './reducer'
import jsonata from 'jsonata'

export const getState = (state: any): RootStateType => state?.root

export const getValue = (state: any, store: string, path: string) => utils.jsonPointerGet(state[store], path)
export const getStoreNameFromType = (store: string, type?: ReduxPathTypeEnum) =>
  // eslint-disable-next-line no-nested-ternary
  type === ReduxPathTypeEnum.ERROR ? `${store}${c.STORE_ERROR_POSTFIX}` : type === ReduxPathTypeEnum.TOUCH ? `${store}${c.STORE_TOUCH_POSTFIX}` : `${store}`

export const getStateValue = (globalState: any, { store, path, type, jsonataDef }: ReduxPath, currentPaths: PathModifiersType) => {
  const state = getState(globalState)

  if (state && store && path) {
    const convertedPath =
      currentPaths && currentPaths[store] && currentPaths[store].path ? utils.changeRelativePath(`${currentPaths[store].path}${c.SEPARATOR}${path}`) : path
    const storeName = getStoreNameFromType(store, type)
    let value = getValue(state, storeName, convertedPath)
    if (jsonataDef) {
      try {
        const expression = jsonata(jsonataDef)
        value = expression.evaluate(value)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('jsonata error', error, jsonataDef)
      }
    }
    if (type === ReduxPathTypeEnum.ERROR) {
      // if we have error, need to show, the empty structure is not error, doesn't matter how deep is it
      return utils.hasLeaf(value) ? value : null
    }
    if (type === ReduxPathTypeEnum.TOUCH) {
      return utils.hasLeaf(value) // return true if is touched.
    }
    return value
  }
  return null
}

export const compSelectorHook = (currentPaths: PathModifiersType, subscriberPaths: ReduxPath[]) => (state: any) => {
  if (typeof subscriberPaths === 'object' && Array.isArray(subscriberPaths) && subscriberPaths?.length > 0) {
    return subscriberPaths.map((subscriberPath) => getStateValue(state, subscriberPath, currentPaths))
  }
  return undefined
}
