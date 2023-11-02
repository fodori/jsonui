import React from 'react'
import orderBy from 'lodash/orderBy'
import traverse from 'traverse'
import * as c from '../utils/constants'
import * as util from '../utils/util'
import Stock from '../stock/Stock'
import { PathModifiersType, PropsType, ReduxPathType, WrapperType } from '../utils/types'
import { V_COMP_NAME } from '../utils/constants'

interface OwnTraverse {
  key: string
  value: PropsType
  path: string[]
  parent: PropsType
  level: number
}

export const getFilteredPath = ({ [c.PARENT_PROP_NAME]: parentComp, ...propsNew }: PropsType, func: (filterProps: OwnTraverse) => boolean): OwnTraverse[] => {
  const paths: OwnTraverse[] = []

  function* jsonTraverse(o: any) {
    const memory = new Set()
    function* innerTraversal(oo: any, path = []): any {
      if (memory.has(oo)) {
        return // circular
      }
      memory.add(oo)
      // eslint-disable-next-line no-restricted-syntax
      for (const i of Object.keys(oo)) {
        const itemPath = path.concat(i as any)
        if (itemPath && itemPath.length > 1 && typeof oo[i] === 'object' && oo[i]?.[V_COMP_NAME]) {
          // eslint-disable-next-line no-continue
          continue
        }
        if (i === c.PARENT_PROP_NAME || i === 'currentPaths' || i === c.LIST_ITEM) {
          // eslint-disable-next-line no-continue
          continue
        }
        if (func({ key: i, value: oo[i], path, parent: oo, level: path.length })) {
          yield { key: i, value: oo[i], path, parent: oo, level: path.length } as OwnTraverse
        }
        if (oo[i] !== null && typeof oo[i] === 'object') {
          yield* innerTraversal(oo[i], itemPath)
        }
      }
    }
    yield* innerTraversal(o)
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const filteredvalue of jsonTraverse(propsNew)) {
    paths.push(filteredvalue)
  }
  return paths
}

export const actionBuilder = (props: PropsType, stock: InstanceType<typeof Stock>) => {
  const { [c.PARENT_PROP_NAME]: parentComp, ...propsNew } = props
  const paths = getFilteredPath(propsNew, ({ key }) => key === c.ACTION_KEY)
  orderBy(paths, ['level'], ['desc']).forEach(async (i) => {
    const { [c.ACTION_KEY]: functionName, ...functionParams } = traverse(props).get(i.path)
    traverse(props).set(i.path, async (...callerArgs: any[]) => {
      await stock.callFunction(functionName, functionParams, props, callerArgs)
    })
  })
}

export const calculatePropsFromModifier = (props: PropsType, stock: InstanceType<typeof Stock>): ReduxPathType[] => {
  const reduxPaths: any = []
  const { [c.PARENT_PROP_NAME]: parentComp, ...propsNew } = props
  const paths = getFilteredPath(propsNew, ({ key }) => key === c.MODIFIER_KEY)
  orderBy(paths, ['level'], ['desc']).forEach(async (i) => {
    const { [c.MODIFIER_KEY]: functionName, ...functionParams } = traverse(props).get(i.path)
    if (typeof functionName === 'string' && functionName === c.REDUX_GET_FUNCTION) {
      reduxPaths.push(functionParams)
    }
    traverse(props).set(i.path, stock.callFunction(functionName, functionParams, props))
  })
  return reduxPaths.map((i: any) => {
    return { store: i?.store, path: i?.path } as ReduxPathType
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

export const normalisePrimitives = (props: PropsType, parentComp?: any): any => {
  let res = {} as PropsType
  // TODO is the props part needed or just the children one
  if (!!props && Array.isArray(props)) {
    res[c.V_COMP_NAME] = c.FRAGMENT_COMP_NAME
    res[c.V_CHILDREN_NAME] = props
    res[c.PARENT_PROP_NAME] = parentComp
  } else if (props === null || c.SIMPLE_DATA_TYPES.includes(typeof props)) {
    res[c.V_COMP_NAME] = c.PRIMITIVE_COMP_NAME
    res[c.V_CHILDREN_NAME] = props
    res[c.PARENT_PROP_NAME] = parentComp
  } else {
    res = { ...props, [c.PARENT_PROP_NAME]: parentComp }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const i in res) if (typeof res[i] === 'undefined') delete res[i]
  return res
}

const genChildenFromListItem = (props: PropsType, stock: InstanceType<typeof Stock>) => {
  let page = !!props[c.LIST_PAGE] && util.isNumber(props[c.LIST_PAGE]) ? (props[c.LIST_PAGE] as number) : 0
  let listLength = !!props[c.LIST_LENGTH] && util.isNumber(props[c.LIST_LENGTH]) ? (props[c.LIST_LENGTH] as number) : undefined
  let itemPerPage = !!props[c.LIST_ITEM_PER_PAGE] && util.isNumber(props[c.LIST_ITEM_PER_PAGE]) ? (props[c.LIST_ITEM_PER_PAGE] as number) : undefined
  const listItem: any = props[c.LIST_ITEM]
  if (!listItem) return undefined
  const currentPaths = props.currentPaths as PathModifiersType
  if (!currentPaths) return undefined
  const store = Object.keys(currentPaths)[0]
  if (!store) return undefined
  const { path } = currentPaths[store]
  if (currentPaths && !listLength) {
    if (path) {
      const list = stock.callFunction('get', { store, path })
      listLength = !!list && Array.isArray(list as any[]) ? list.length : 0
    }
  }
  if (!itemPerPage) {
    itemPerPage = listLength
  }

  page = Number.isInteger(page) && page >= 0 ? page : 0
  itemPerPage = !!itemPerPage && Number.isInteger(itemPerPage) && itemPerPage >= 0 ? itemPerPage : 0
  listLength = !!listLength && Number.isInteger(listLength) && listLength >= 0 ? listLength : 0
  const offset = page * itemPerPage <= listLength ? page * itemPerPage : 0

  const children: PropsType[] = []
  // eslint-disable-next-line no-plusplus
  for (let i = offset; i < listLength && i < offset + itemPerPage; i++) {
    children.push({
      ...(listItem as PropsType),
      [c.PATH_MODIFIERS_KEY]: {
        [store]: {
          path: `.${c.SEPARATOR}${i}`,
        },
      } as PathModifiersType,
    })
  }
  return children.length > 0 ? children : undefined
}

export const getRootWrapperProps = (props: PropsType, stock: InstanceType<typeof Stock>) => {
  const newProps = {
    ...props,
    // if the children generation move to wrapper, the redux genAllStateProps doesn't wortk properly. why?
  }
  const subscriberPaths = calculatePropsFromModifier(newProps, stock)
  actionBuilder(newProps, stock)
  if (newProps[c.LIST_SEMAPHORE]) {
    newProps[c.V_CHILDREN_NAME] = genChildenFromListItem(newProps, stock)
  }
  newProps.subscriberPaths = subscriberPaths
  return newProps
}

export const isChildrenProps = (propName?: string): boolean => !!propName && typeof propName === 'string' && propName.startsWith(c.V_CHILDREN_PREFIX)

export const getParentProps = (props: PropsType): PropsType => {
  return props && typeof props === 'object' && !Array.isArray(props)
    ? Object.keys(props)
        .filter((key) => !isChildrenProps(key) && key !== c.PARENT_PROP_NAME)
        .reduce((newObj, key) => {
          // eslint-disable-next-line no-param-reassign
          newObj[key] = props[key]
          return newObj
        }, {} as PropsType)
    : ({} as PropsType)
}

export const getPropsChildrenFilter = ({ props, filter }: { props: PropsType; filter: 'onlyChildren' | 'withoutChildren' }): PropsType =>
  props && typeof props === 'object' && !Array.isArray(props)
    ? Object.keys(props)
        .filter(
          (key) =>
            ((filter === 'withoutChildren' && !isChildrenProps(key)) || (filter === 'onlyChildren' && isChildrenProps(key))) && key !== c.PARENT_PROP_NAME
        )
        .reduce((newObj, key) => {
          // eslint-disable-next-line no-param-reassign
          newObj[key] = props[key]
          return newObj
        }, {} as PropsType)
    : ({} as PropsType)

export const getChildrensForRoot = (props: PropsType, children: any, Wrapper: WrapperType) => {
  // eslint-disable-next-line no-nested-ternary
  if (!!props && Array.isArray(children)) {
    return children.map((childrenItem, index) => {
      // eslint-disable-next-line react/no-array-index-key
      return <Wrapper key={index} props={normalisePrimitives(childrenItem, getParentProps(props))} />
    })
  }
  if (!!props && !!children) {
    return <Wrapper props={normalisePrimitives(children, getParentProps(props))} />
  }
  return undefined
}

export const generateChildren = (props: PropsType, { Wrapper }: InstanceType<typeof Stock>) =>
  props[c.V_COMP_NAME] !== '_PrimitiveProp' ? getChildrensForRoot(props, props[c.V_CHILDREN_NAME], Wrapper as WrapperType) : props[c.V_CHILDREN_NAME]

export const generateNewChildren = (props: PropsType, { Wrapper }: InstanceType<typeof Stock>) => {
  // eslint-disable-next-line no-nested-ternary
  if (props) {
    if (Array.isArray(props)) {
      return props.map((childrenItem, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <Wrapper key={index} props={normalisePrimitives(childrenItem, getParentProps(props))} />
      })
    }
    return <Wrapper props={normalisePrimitives(props, getParentProps(props))} />
  }
  return undefined
}
