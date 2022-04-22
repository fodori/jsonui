import produce from 'immer'
import { AnyAction } from 'redux'
import { ValidationType } from '../../utils/types'
import * as c from '../../utils/constants'
import * as util from '../../utils/util'
import { validateJSON } from '../../stock/validation'
import { DATA_UPDATE, PURGE } from './actions'
import Stock from '../../stock/Stock'

export type RootStateType = any

const initialState: RootStateType = {}
const validateNewState = (stock: InstanceType<typeof Stock>, newState: RootStateType, actionStore: string, actionPath: string) => {
  if (stock?.validations) {
    stock.validations.forEach((validateItem: ValidationType) => {
      if (validateItem.store === actionStore && `${actionPath}`.startsWith(validateItem.path)) {
        if (validateItem.schema) {
          const stateToBeValidated = util.jsonPointerGet(newState, `${c.SEPARATOR}${actionStore}${validateItem.path}`)
          const errors = validateJSON(validateItem.schema, actionStore, stateToBeValidated)
          // console.log('matched validator', `${c.SEPARATOR}${errors.store}${validateItem.path}`, errors)
          // eslint-disable-next-line no-param-reassign
          newState = util.jsonPointerSet(newState, `${c.SEPARATOR}${errors.store}${validateItem.path}`, errors.value)
        }
      }
    })
  }
}

const reducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case DATA_UPDATE: {
      const { store, path, value, jsonataDef, currentPaths, stock } = action.payload
      if (store && path) {
        const storekey = `${store}`
        const convertedPath =
          currentPaths && currentPaths[storekey] && currentPaths[storekey].path
            ? util.changeRelativePath(`${currentPaths[storekey].path}${c.SEPARATOR}${path}`)
            : util.changeRelativePath(path)
        const absolutePathWithStoreKey = `${c.SEPARATOR}${storekey}${convertedPath}`
        const newState = produce(state, (draft: RootStateType) => {
          if (jsonataDef) {
            try {
              // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
              const jsonata = require('jsonata')
              const expression = jsonata(jsonataDef)
              const newValue = expression.evaluate(value)
              // eslint-disable-next-line no-param-reassign
              draft = util.jsonPointerSet(draft, absolutePathWithStoreKey, newValue)
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('jsonata error', error, jsonataDef)
              // eslint-disable-next-line no-param-reassign
              draft = util.jsonPointerSet(draft, absolutePathWithStoreKey, value)
            }
          } else {
            // eslint-disable-next-line no-param-reassign
            draft = util.jsonPointerSet(draft, absolutePathWithStoreKey, value)
          }
          // if validatior has match, need to validate it synchronously
          validateNewState(stock, draft, store, convertedPath)
        })
        return newState
      }
      return state
    }
    case PURGE: {
      return initialState
    }
    default:
      return state
  }
}

export default reducer
