import React from 'react'
import * as c from 'utils/constants'

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

export interface SubscriberPath {
  store?: string
  path?: string
}
