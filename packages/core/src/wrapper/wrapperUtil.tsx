import React from 'react'
import orderBy from 'lodash/orderBy'
import traverse from 'traverse'
import * as c from 'utils/constants'
import * as util from 'utils/util'
import Stock from 'stock/Stock'
import { PathModifiersType, PathModifierType, PathsType, PropsType, WrapperType } from '../utils/types'

export const actionBuilder = (props: PropsType, stock: InstanceType<typeof Stock>) => {
  const paths: PathsType = []
  const { parentComp, ...propsNew } = props
  // eslint-disable-next-line func-names
  traverse(propsNew).forEach(function (x) {
    if (
      !!x &&
      !!x[c.ACTION_KEY] &&
      // && !c.REDUX_FUNCTIONS.includes(x[c.ACTION_KEY])
      !(this.path.length > 1 && this.path.includes(c.V_CHILDREN_NAME))
    ) {
      paths.push({ path: this.path, level: this.level })
    }
  })
  orderBy(paths, ['level'], ['desc']).forEach(async (i) => {
    const { [c.ACTION_KEY]: functionName, ...functionParams } = traverse(props).get(i.path)
    traverse(props).set(i.path, async (...callerArgs: any[]) => {
      await stock.callFunction(functionName, functionParams, props, callerArgs)
    })
  })
}

export const modifierBuilder = (props: PropsType, stock: InstanceType<typeof Stock>) => {
  const paths: PathsType = []
  const { parentComp, ...propsNew } = props
  // eslint-disable-next-line func-names
  traverse(propsNew).forEach(function (x) {
    if (!!x && !!x[c.MODIFIER_KEY] && !c.REDUX_FUNCTIONS.includes(x[c.MODIFIER_KEY]) && !(this.path.length > 1 && this.path.includes(c.V_CHILDREN_NAME))) {
      paths.push({ path: this.path, level: this.level })
    }
  })
  orderBy(paths, ['level'], ['desc']).forEach(async (i) => {
    const { [c.MODIFIER_KEY]: functionName, ...functionParams } = traverse(props).get(i.path)
    traverse(props).set(i.path, stock.callFunction(functionName, functionParams, props))
  })
}

export const pathModifierBuilder = (props: PropsType, pathModifier: PathModifiersType) => {
  const currentPaths: PathModifiersType = { ...(props.currentPaths as PathModifiersType) }
  let modified = false
  if (pathModifier && Object.keys(pathModifier).length !== 0) {
    Object.keys(pathModifier).forEach((key: string) => {
      if (!!key && !!pathModifier[key] && pathModifier[key][c.PATHNAME] !== undefined && pathModifier[key][c.PATHNAME] !== null) {
        const path = pathModifier[key][c.PATHNAME]
        const parent = currentPaths[key]
        modified = true
        if (`${path}`.startsWith(c.SEPARATOR) || !(parent && parent[c.PATHNAME])) {
          currentPaths[key] = { [c.PATHNAME]: path }
        } else {
          currentPaths[key] = { [c.PATHNAME]: util.changeRelativePath(`${parent[c.PATHNAME]}${c.SEPARATOR}${path}`) }
        }
        if (!!currentPaths[key] && !`${currentPaths[key][c.PATHNAME]}`.startsWith(c.SEPARATOR)) {
          currentPaths[key][c.PATHNAME] = `${c.SEPARATOR}${currentPaths[key][c.PATHNAME]}`
        }
      }
    })
  }
  return modified ? { currentPaths } : undefined
}

export const getWrapperProps = (props: PropsType, parentComp?: any) => {
  const res: PropsType = {
    ...(c.SIMPLE_DATA_TYPES.includes(typeof props) ? {} : props),
    parentComp,
    [c.V_COMP_NAME]: c.SIMPLE_DATA_TYPES.includes(typeof props) || props === undefined || props === null ? '_PrimitiveProp' : props[c.V_COMP_NAME],
    [c.V_CHILDREN_NAME]: c.SIMPLE_DATA_TYPES.includes(typeof props) || props === undefined || props === null ? props : props[c.V_CHILDREN_NAME],
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const i in res) if (typeof res[i] === 'undefined') delete res[i]
  return res
}

const genChildenFromListItem = (props: PropsType) => {
  let { page = 0, listLength = 0, itemPerPage = c.PAGINATION_ITEM_PER_PAGE } = props as { page?: number; listLength?: number; itemPerPage?: number }
  const { listItem } = props
  const pathModifiers: PathModifiersType = props[c.PATH_MODIFIERS_KEY] as PathModifiersType
  if (util.isNumber(page) && util.isNumber(listLength) && util.isNumber(itemPerPage) && pathModifiers) {
    const children: PropsType[] = []
    page = page >= 0 ? page : 0
    itemPerPage = itemPerPage >= 0 ? itemPerPage : 0
    listLength = listLength >= 0 ? listLength : 0
    const offset = page * itemPerPage <= listLength ? page * itemPerPage : 0
    const itemkey: string = Object.keys(pathModifiers)[0]
    const firstItem: PathModifierType = pathModifiers[itemkey]
    // eslint-disable-next-line no-plusplus
    for (let i = offset; i < listLength && i < offset + itemPerPage; i++) {
      children.push({
        ...(listItem as PropsType),
        [c.PATH_MODIFIERS_KEY]: {
          ...(pathModifiers as PathModifiersType),
          [Object.keys(pathModifiers)[0]]: {
            ...(firstItem as PathModifierType),
            path: i,
          },
        } as PathModifiersType,
      })
    }
    return children.length > 0 ? children : undefined
  }
  return undefined
}

export const getRootWrapperProps = (props: PropsType, stock: InstanceType<typeof Stock>) => {
  const newProps = {
    ...props,
    // if the children generation move to wrapper, the redux genAllStateProps doesn't wortk properly. why?
  }
  modifierBuilder(newProps, stock)
  actionBuilder(newProps, stock)
  if (newProps.isList) {
    newProps[c.V_CHILDREN_NAME] = genChildenFromListItem(newProps)
  }

  return newProps
}

export const getChildrensForRoot = (props: PropsType, children: any, Wrapper: WrapperType) => {
  const { parentComp, [c.V_CHILDREN_NAME]: _notused, ...newParentComp } = props
  // eslint-disable-next-line no-nested-ternary
  if (!!props && Array.isArray(children)) {
    return children.map((childrenItem, index) => {
      // eslint-disable-next-line react/no-array-index-key
      return <Wrapper key={index} {...getWrapperProps(childrenItem, newParentComp)} />
    })
  }
  if (!!props && !!children) {
    return <Wrapper {...getWrapperProps(children, newParentComp)} />
  }
  return undefined
}

export const generateChildren = (props: PropsType, { Wrapper }: InstanceType<typeof Stock>) =>
  props[c.V_COMP_NAME] !== '_PrimitiveProp' ? getChildrensForRoot(props, props[c.V_CHILDREN_NAME], Wrapper as WrapperType) : props[c.V_CHILDREN_NAME]
