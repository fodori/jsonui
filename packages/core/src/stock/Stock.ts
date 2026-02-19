import { JsonUIComponentsType, JsonUIComponentType, JsonUIFunctions, JsonUIFunctionType } from 'utils/types'

interface NewStockType {
  components: JsonUIComponentsType
  functions: JsonUIFunctions
}

type InitType = (prop: NewStockType) => void
type RegisterFunctionType = (key: string, value: JsonUIFunctionType) => void
type RegisterComponentType = (key: string, value: JsonUIComponentType) => void
type CallFunctionType = (name: string, attr?: any, props?: any, callerArgs?: any) => any | Promise<any>
type GetComponentType = (componentName: string) => JsonUIComponentType

export default class Stock {
  stock: NewStockType

  Wrapper: React.ElementType

  reduxStore: any

  validations: any

  constructor(newStock: NewStockType, Wrapper: React.ElementType, reduxStore: any) {
    this.stock = {
      components: {} as JsonUIComponentsType,
      functions: {} as JsonUIFunctions,
    }
    this.Wrapper = Wrapper
    this.validations = []
    this.reduxStore = reduxStore
    this.init(newStock)
  }

  init: InitType = ({ components, functions }) => {
    this.stock.components = {
      ...this.stock.components,
      ...components,
    }
    this.stock.functions = {
      ...this.stock.functions,
      ...functions,
    }
  }

  registerComponent: RegisterComponentType = (key, value) => {
    if (!!key && typeof key === 'string' && key.length > 0 && !(key in this.stock.components)) {
      this.stock.components[key] = value
    }
  }

  registerFunction: RegisterFunctionType = (key, value) => {
    if (!!key && typeof key === 'string' && key.length > 0 && !(key in this.stock.functions)) {
      this.stock.functions[key] = value
    }
  }

  callFunction: CallFunctionType = async (name, attr, props, callerArgs) => {
    // console.log('callFunction: ', name, attr, props, callerArgs)
    if (!!attr && !!name && name in this.stock.functions) {
      const result = this.stock.functions[name](attr, props, callerArgs, this)
      // Handle both sync and async functions
      return result instanceof Promise ? await result : result
    }
    return null
  }

  isAsyncFunction: (name: string) => boolean = (name) => {
    if (!!name && name in this.stock.functions) {
      // Check if function is marked as async or returns a promise
      const func = this.stock.functions[name]
      return func.constructor.name === 'AsyncFunction' || (func as any).isAsync === true
    }
    return false
  }

  getComponent: GetComponentType = (componentName) =>
    !!componentName && componentName in this.stock.components
      ? this.stock.components[componentName]
      : // eslint-disable-next-line no-underscore-dangle
        this.stock.components._Undefined
}
