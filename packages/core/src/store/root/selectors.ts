import traverse from 'traverse'
import orderBy from 'lodash/orderBy'
import * as c from '../../utils/constants'
import * as util from '../../utils/util'
import { PathModifiersType, PathType, PropsType, SubscriberPath } from '../../utils/types'
import { RootStateType } from './reducer'

export const getState = (state: any): RootStateType => state?.root

export const getValue = (state: any, store: string, path: string) => util.jsonPointerGet(state[store], path) || null

export interface ReduxPathType {
  store: string
  path: string
  isError?: boolean
}

export const getStateValue = (globalState: any, { store, path, isError = false }: ReduxPathType, currentPaths: PathModifiersType) => {
  const state = getState(globalState)

  if (state && store && path) {
    const convertedPath =
      currentPaths && currentPaths[store] && currentPaths[store].path ? util.changeRelativePath(`${currentPaths[store].path}${c.SEPARATOR}${path}`) : path

    return getValue(state, `${store}${isError ? c.STORE_ERROR_POSTFIX : ''}`, convertedPath)
  }
  return null
}

export const genAllStateProps = (globalState: any, props: PropsType) => {
  const { currentPaths } = props
  const result: PropsType = {}
  const paths: PathType[] = []
  const { parentComp, ...propsNew } = props
  // eslint-disable-next-line func-names
  traverse(propsNew).forEach(function (x) {
    if (!!x && !!x[c.MODIFIER_KEY] && x[c.MODIFIER_KEY] === 'get' && !(this.path.length > 1 && this.path.includes(c.V_CHILDREN_NAME))) {
      paths.push({ path: this.path, level: this.level })
    }
  })
  orderBy(paths, ['level'], ['desc']).forEach(async (i) => {
    const { [c.MODIFIER_KEY]: functionName, ...functionParams } = traverse(props).get(i.path)
    if (functionName === 'get' && functionParams.store && functionParams.path) {
      let value = getStateValue(globalState, functionParams, currentPaths as PathModifiersType)
      if (functionParams.jsonataDef) {
        try {
          // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
          const jsonata = require('jsonata')
          const expression = jsonata(functionParams.jsonataDef)
          value = expression.evaluate(value)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('jsonata error', error, functionParams.jsonataDef)
        }
      }
      // traverse(result).set(i.path, value)
      result[util.pathArrayToJsonPointer(i.path)] = value
    }
  })
  return result
}

export const compSelectorHook = (currentPaths: PathModifiersType | undefined, subscriberPaths: SubscriberPath[]) => (origstate: any) => {
  const state = getState(origstate) || {}
  if (!(typeof subscriberPaths === 'object' && Array.isArray(subscriberPaths) && subscriberPaths?.length)) {
    return []
  }
  const isError = false
  // TODO isError, currentPaths, root need to solve propperly
  return subscriberPaths.map(({ store, path }) => {
    if (state && store && path) {
      const convertedPath =
        currentPaths && currentPaths[store] && currentPaths[store].path ? util.changeRelativePath(`${currentPaths[store].path}${c.SEPARATOR}${path}`) : path
      return getValue(state, `${store}${isError ? c.STORE_ERROR_POSTFIX : ''}`, convertedPath)
    }
    return null
  })
}
