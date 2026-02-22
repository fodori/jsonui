import React from 'react'
import orderBy from 'lodash/orderBy'
import traverse from 'traverse'
import * as c from '../utils/constants'
import * as utils from '../utils/jsonUtils'
import Stock from '../stock/Stock'
import { PathModifiersType, PropsType, ReduxPath, WrapperType } from '../utils/types'
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
        if (i === c.PARENT_PROP_NAME || i === c.CURRENT_PATH_NAME || i === c.LIST_ITEM) {
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
  // TODO this approach call the action but don't wait it. for chain is not good, use modifier in lower level. an just the top could be an action. like onClick.
  const { [c.PARENT_PROP_NAME]: parentComp, ...propsNew } = props
  const paths = getFilteredPath(propsNew, ({ key }) => key === c.ACTION_KEY)
  orderBy(paths, ['level'], ['desc']).forEach((i) => {
    const { [c.ACTION_KEY]: functionName, ...functionParams } = traverse(props).get(i.path)
    traverse(props).set(i.path, (...callerArgs: any[]) => {
      const innerFunc = async () => {
        await stock.callFunction(functionName, functionParams, props, callerArgs)
      }
      innerFunc()
    })
  })
}

// Helper function to get value from object using path array
const getValueByPath = (obj: any, path: string[]): any => {
  let current = obj
  for (const key of path) {
    if (current == null || typeof current !== 'object') return undefined
    current = current[key]
  }
  return current
}

// Helper function to set value in object using path array
const setValueByPath = (obj: any, path: string[], value: any): void => {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  current[path[path.length - 1]] = value
}

export const calculatePropsFromModifier = async (props: PropsType, stock: InstanceType<typeof Stock>): Promise<ReduxPath[]> => {
  const reduxPaths: any = []
  const { [c.PARENT_PROP_NAME]: parentComp, ...propsNew } = props
  const paths = getFilteredPath(propsNew, ({ key }) => key === c.MODIFIER_KEY)

  if (paths.length === 0) return reduxPaths

  // Cache for deduplicating identical function calls
  const callCache = new Map<string, Promise<any>>()

  // Sort paths by level descending - use faster native sort
  const sortedPaths = paths.sort((a, b) => b.level - a.level)

  // Batch process all modifiers
  const modifierPromises = sortedPaths.map(async (pathItem) => {
    const modifierObj = getValueByPath(props, pathItem.path)
    const functionName = modifierObj[c.MODIFIER_KEY]

    // Early return for redux functions
    if (typeof functionName === 'string' && functionName === c.REDUX_GET_FUNCTION) {
      const { [c.MODIFIER_KEY]: _, ...functionParams } = modifierObj
      reduxPaths.push(functionParams)
    }

    // Create cache key for deduplication
    const cacheKey = JSON.stringify({ fn: functionName, params: modifierObj })

    // Check cache first
    let resultPromise = callCache.get(cacheKey)
    if (!resultPromise) {
      const { [c.MODIFIER_KEY]: _, ...functionParams } = modifierObj
      resultPromise = stock.callFunction(functionName, functionParams, props, [])
      callCache.set(cacheKey, resultPromise as any)
    }

    const res = resultPromise instanceof Promise ? await resultPromise : resultPromise
    return { path: pathItem.path, result: res }
  })

  // Execute all promises and update paths
  const results = await Promise.all(modifierPromises)

  // Batch update all paths at once
  results.forEach(({ path, result }) => {
    setValueByPath(props, path, result)
  })

  return reduxPaths
}

export const getCurrentPaths = (props: PropsType, pathModifier: PathModifiersType) => {
  const currentPaths: PathModifiersType = { ...(props[c.CURRENT_PATH_NAME] as PathModifiersType) }
  if (pathModifier && Object.keys(pathModifier).length !== 0) {
    Object.keys(pathModifier).forEach((key: string) => {
      if (!!key && !!pathModifier[key] && pathModifier[key][c.PATHNAME] !== undefined && pathModifier[key][c.PATHNAME] !== null) {
        const path = pathModifier[key][c.PATHNAME]
        const parent = currentPaths[key]
        if (`${path}`.startsWith(c.SEPARATOR) || !(parent && parent[c.PATHNAME])) {
          currentPaths[key] = { [c.PATHNAME]: path }
        } else {
          currentPaths[key] = { [c.PATHNAME]: utils.changeRelativePath(`${parent[c.PATHNAME]}${c.SEPARATOR}${path}`) }
        }
        if (!!currentPaths[key] && !`${currentPaths[key][c.PATHNAME]}`.startsWith(c.SEPARATOR)) {
          currentPaths[key][c.PATHNAME] = `${c.SEPARATOR}${currentPaths[key][c.PATHNAME]}`
        }
      }
    })
  }
  return currentPaths
}

export const normalisePrimitives = (props: PropsType, parentComp?: any): any => {
  if (!!props && Array.isArray(props)) {
    return { [c.V_COMP_NAME]: c.FRAGMENT_COMP_NAME, [c.V_CHILDREN_NAME]: props, [c.PARENT_PROP_NAME]: parentComp }
  }
  if (props === null || c.SIMPLE_DATA_TYPES.includes(typeof props)) {
    return { [c.V_COMP_NAME]: c.PRIMITIVE_COMP_NAME, [c.V_CHILDREN_NAME]: props, [c.PARENT_PROP_NAME]: parentComp }
  }
  return { ...props, [c.PARENT_PROP_NAME]: parentComp }
}

export const genChildenFromListItem = (props: PropsType, stock: InstanceType<typeof Stock>) => {
  let page = !!props[c.LIST_PAGE] && utils.isNumber(props[c.LIST_PAGE]) ? (props[c.LIST_PAGE] as number) : 0
  let listLength = !!props[c.LIST_LENGTH] && utils.isNumber(props[c.LIST_LENGTH]) ? (props[c.LIST_LENGTH] as number) : undefined
  let itemPerPage = !!props[c.LIST_ITEM_PER_PAGE] && utils.isNumber(props[c.LIST_ITEM_PER_PAGE]) ? (props[c.LIST_ITEM_PER_PAGE] as number) : undefined
  const listItem: any = props[c.LIST_ITEM]
  if (!listItem) return undefined
  const currentPaths = props[c.CURRENT_PATH_NAME] as PathModifiersType
  if (!currentPaths) return undefined
  const store = Object.keys(currentPaths)[0]
  if (!store) return undefined
  const { path } = currentPaths[store]
  if (currentPaths && !listLength) {
    if (path) {
      const list = stock.callFunctionSync(c.REDUX_GET_FUNCTION, { store, path }) // TODO maybe modify to async?
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
  console.log('generateNewChildren for list: ', { page, itemPerPage, listLength, offset })
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

export const getRootWrapperProps = async (props: PropsType, stock: InstanceType<typeof Stock>): Promise<any> => {
  const start = performance.now() * 100
  const subscriberPaths: any[] = []
  const resultProps = await processModifiers(props, stock, subscriberPaths)
  const modifier = performance.now() * 100
  console.log(`Execution time(modifier): ${Math.round(modifier - start)}`)
  if (resultProps[c.LIST_SEMAPHORE]) {
    resultProps[c.V_CHILDREN_NAME] = genChildenFromListItem(resultProps, stock)
  }
  // eslint-disable-next-line no-param-reassign
  resultProps[c.REDUX_GET_SUBSCRIBERS_NAME] = subscriberPaths
  const genChilden = performance.now() * 100
  console.log(`Execution time(genChildenFromListItem): ${Math.round(genChilden - modifier)}`)
  return resultProps
}

export const isChildrenProp = (propName?: string): boolean => !!propName && typeof propName === 'string' && propName.startsWith(c.V_CHILDREN_PREFIX)

export const getParentProps = (props: PropsType): PropsType => {
  return props && typeof props === 'object' && !Array.isArray(props)
    ? Object.keys(props)
        .filter((key) => !isChildrenProp(key) && key !== c.PARENT_PROP_NAME)
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
          (key) => ((filter === 'withoutChildren' && !isChildrenProp(key)) || (filter === 'onlyChildren' && isChildrenProp(key))) && key !== c.PARENT_PROP_NAME
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

export const isTechnicalProp = (propName: string) =>
  [
    c.PARENT_PROP_NAME,
    c.STYLE_WEB_NAME,
    c.V_COMP_NAME,
    c.PATH_MODIFIERS_KEY,
    c.CURRENT_PATH_NAME,
    c.PATH_MODIFIERS_KEY,
    c.LIST_SEMAPHORE,
    c.LIST_ITEM,
    c.LIST_PAGE,
    c.LIST_ITEM_PER_PAGE,
    c.LIST_LENGTH,
    c.REF_VALIDATES,
    'style',
    c.REDUX_GET_SUBSCRIBERS_NAME,
  ].includes(propName)

export const removeTechnicalProps = (changeableProps: any) => {
  const {
    [c.PARENT_PROP_NAME]: parentComp,
    style,
    [c.STYLE_WEB_NAME]: _unused1,
    [c.V_COMP_NAME]: _unused2,
    [c.PATH_MODIFIERS_KEY]: _unused3,
    [c.CURRENT_PATH_NAME]: _unused4,
    [c.REDUX_GET_SUBSCRIBERS_NAME]: _unused5,
    [c.PATH_MODIFIERS_KEY]: _unused6,
    [c.LIST_SEMAPHORE]: _unused7,
    [c.LIST_ITEM]: _unused8,
    [c.LIST_PAGE]: _unused9,
    [c.LIST_ITEM_PER_PAGE]: _unused10,
    [c.LIST_LENGTH]: _unused11,
    [c.REF_VALIDATES]: _unused12,
    ...newProps
  } = changeableProps
  return newProps
}

export const processModifiers = async (obj: PropsType, stock: InstanceType<typeof Stock>, reduxPaths: any[]): Promise<any> => {
  // Fast type checks - avoid expensive operations
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // Array handling - process each element
  if (Array.isArray(obj)) {
    const hasModifiers = obj.some(
      (item) =>
        item && typeof item === 'object' && (item[c.MODIFIER_KEY] || item[c.ACTION_KEY] || Object.values(item).some((val) => val && typeof val === 'object'))
    )

    if (!hasModifiers) return obj
    const result = new Array(obj.length)
    const promises = obj.map((item) => processModifiers(item, stock, reduxPaths))
    return Promise.all(promises)
  }
  const { [c.MODIFIER_KEY]: modifierFunctionName, [c.ACTION_KEY]: actionfunctionName, ...functionParams } = obj

  const hasNestedObjects = Object.values(functionParams).some((val) => val && typeof val === 'object')

  if (!modifierFunctionName && !actionfunctionName && !hasNestedObjects) {
    return obj
  }

  // Regular object - process all properties
  const result: any = {}
  const propertyPromises: Promise<void>[] = []

  for (const key in functionParams) {
    if (typeof functionParams[key] === 'object') {
      propertyPromises.push(
        processModifiers(functionParams[key] as any, stock, reduxPaths).then((resolvedValue) => {
          result[key] = resolvedValue
        })
      )
    } else {
      result[key] = functionParams[key]
    }
  }

  await Promise.all(propertyPromises)

  if (modifierFunctionName) {
    if (modifierFunctionName === c.REDUX_GET_FUNCTION) {
      reduxPaths.push(functionParams)
    }
    return await stock.callFunction(modifierFunctionName as string, result, obj, [])
  } else if (actionfunctionName) {
    return async (...callerArgs: any[]) => {
      await stock.callFunction(actionfunctionName as string, result, obj, callerArgs)
    }
  }
  return result
}
