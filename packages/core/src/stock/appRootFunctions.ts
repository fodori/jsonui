import { JsonUIFunctions, JsonUIFunctionType } from 'utils/types'
import { purge } from '../store/root/actions'

export const deletePersistDataStore: JsonUIFunctionType = async (attr, props, callerArgs, stock) => {
  stock.reduxStore.dispatch(purge(null))
  await stock.callFunction('reloadApp', {})
}

const appRootFunctions: JsonUIFunctions = { deletePersistDataStore }

export default appRootFunctions
