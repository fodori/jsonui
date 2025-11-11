import { produce, current } from 'immer'
import { AnyAction } from 'redux'
import { ValidationType } from '../../utils/types'
import * as c from '../../utils/constants'
import * as util from '../../utils/jsonUtils'
import { validateJSONAndStore } from '../../stock/validation'
import { DATA_UPDATE } from './actions'
import Stock from '../../stock/Stock'

export type RootStateType = any

const initialState: RootStateType = {}
const globalValidateNewState = (stock: InstanceType<typeof Stock>, newState: RootStateType, actionStore: string, actionPath: string) => {
  if (stock?.validations) {
    stock.validations.forEach((validateItem: ValidationType) => {
      if (validateItem.store === actionStore && `${actionPath}`.startsWith(validateItem.path)) {
        if (validateItem.schema) {
          const state = current(newState)
          const stateToBeValidated = util.jsonPointerGet(state, `${c.SEPARATOR}${actionStore}${validateItem.path}`)
          const errors = validateJSONAndStore(validateItem.schema, actionStore, stateToBeValidated)
          // eslint-disable-next-line no-param-reassign
          newState = util.jsonPointerSet(newState, `${c.SEPARATOR}${errors.store}${validateItem.path}`, errors.value)
        }
      }
    })
  }
}

const reducer = (state = initialState, action: AnyAction) => {
  switch (action?.type) {
    case DATA_UPDATE: {
      const {
        store = undefined,
        path = undefined,
        value = undefined,
        jsonataDef = undefined,
        [c.CURRENT_PATH_NAME]: currentPaths = undefined,
        stock = undefined,
      } = action?.payload || {}
      if (store && path && util.isValidJson(value)) {
        const storekey = `${store}`
        let convertedPath =
          currentPaths && currentPaths[storekey] && currentPaths[storekey].path
            ? util.changeRelativePath(`${currentPaths[storekey].path}${c.SEPARATOR}${path}`)
            : util.changeRelativePath(path)
        convertedPath = util.jsonPointerFix(convertedPath)

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
          // set, if a leaf touched
          // TODO if array or object touched, can easily overwite the leaf touched
          // eslint-disable-next-line no-param-reassign
          draft = util.jsonPointerSet(draft, `${c.SEPARATOR}${storekey}${c.STORE_TOUCH_POSTFIX}${convertedPath}`, true)
          // if validatior has match, need to validate it synchronously
          globalValidateNewState(stock, draft, store, convertedPath)
        })
        return newState
      }
      return state
    }
    default:
      return state
  }
}

export default reducer
