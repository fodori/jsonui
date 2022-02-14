import { purge } from '../store/root/actions'

export type JsonUIFunctionType = (attr: any, props: any, callerArgs: any, stock: any) => Promise<void> | void | any

export interface JsonUIFunctions {
  [key: string]: JsonUIFunctionType
}
export const deletePersistDataStore: JsonUIFunctionType = async (attr, props, callerArgs, stock) => {
  stock.reduxStore.dispatch(purge(null))
  await stock.callFunction('reloadApp', {})
}

const appRootFunctions: JsonUIFunctions = { deletePersistDataStore }

export default appRootFunctions
