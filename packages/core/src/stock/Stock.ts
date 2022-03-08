import { ReactNode } from 'react'
import { JsonUIFunctions, JsonUIFunctionType } from './appRootFunctions'

interface JsonUIComponentsType {
  [key: string]: ReactNode
}

interface NewStockType {
  components: JsonUIComponentsType
  functions: JsonUIFunctions
}

type InitType = (prop: NewStockType) => void
type RegisterFunctionType = (key: string, value: JsonUIFunctionType) => void
type RegisterComponentType = (key: string, value: ReactNode) => void
type CallFunctionType = (name: string, attr?: any, props?: any, callerArgs?: any) => any
type GetComponentType = (componentName: string) => ReactNode

export default class Stock {
  stock: NewStockType

  Wrapper: ReactNode

  reduxStore: any

  validations: any

  constructor(newStock: NewStockType, Wrapper: ReactNode, reduxStore: any) {
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

  callFunction: CallFunctionType = (name, attr, props, callerArgs) => {
    if (!!attr && !!name && name in this.stock.functions) {
      const result = this.stock.functions[name](attr, props, callerArgs, this)
      return result
    }
    return null
  }

  getComponent: GetComponentType = (componentName) =>
    !!componentName && componentName in this.stock.components
      ? this.stock.components[componentName]
      : // eslint-disable-next-line no-underscore-dangle
        this.stock.components._Undefined
}
