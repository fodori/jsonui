import React from 'react'
import * as c from './constants'

export type UIDefinition = any
export type Path = string
export type ArraysType = any[]
export type WrapperType = React.ElementType

// eslint-disable-next-line no-use-before-define
export type PropValue = PropsType | ArraysType | string | null | boolean | number | undefined | PathModifiersType

export interface PathModifierType {
  path: string
}
export interface PathModifiersType {
  [key: string]: PathModifierType
}

export interface PropsType {
  [key: string]: PropValue
  [c.PATH_MODIFIERS_KEY]?: PathModifiersType
}

export interface PathType {
  path: string[]
  level: number
}

export type PathsType = PathType[]

export interface ValidationType {
  store: string
  path: string
  schema: any
}

// eslint-disable-next-line no-shadow
export enum ReduxPathTypeEnum {
  ERROR = 'ERROR',
  TOUCH = 'TOUCH',
  NORMAL = 'NORMAL',
}

export interface ReduxPath {
  store?: string
  path?: string
  type?: ReduxPathTypeEnum
  jsonataDef?: string
}

export type JsonUIComponentType = React.FC<any> | typeof React.Component | ((prop: any) => number | null | undefined | string)

export interface JsonUIComponentsType {
  [key: string]: JsonUIComponentType
}
export type JsonUIFunctionType = (attr: any, props: any, callerArgs: any, stock: any) => Promise<void> | void | any

export interface JsonUIFunctions {
  [key: string]: JsonUIFunctionType
}
