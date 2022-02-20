import jsonpointer from 'jsonpointer'
import cloneDeep from 'lodash/cloneDeep'
import drop from 'lodash/drop'
import findIndex from 'lodash/findIndex'
import pull from 'lodash/pull'
import compact from 'lodash/compact'
import findLastIndex from 'lodash/findLastIndex'
import unset from 'lodash/unset'
import * as c from './constants'
import { PropsType } from './types'

export const jsonPointerGet = (json: any, path?: string) => {
  if (json === undefined || path === null || path === undefined || typeof path !== 'string') return undefined
  if (path === c.SEPARATOR /* || path === '' same effect */) return json
  try {
    return jsonpointer.get(json, path.startsWith(c.SEPARATOR) ? path : `${c.SEPARATOR}${path}`)
  } catch (e) {
    return undefined
  }
}

export const jsonPointerSet = (json: any, path?: string, value?: any) => {
  if (json === undefined || path === null || path === undefined || typeof path !== 'string') return json
  if (path === c.SEPARATOR || path === '') {
    return value
  }
  try {
    jsonpointer.set(json, path.startsWith(c.SEPARATOR) ? path : `${c.SEPARATOR}${path}`, value)
    return json
    // eslint-disable-next-line no-empty
  } catch (e) {
    return json
  }
}

export const pathArrayToPathString = (array: string[]) => array.map((i, index) => (Number.isInteger(i) ? `[${i}]` : `${index > 0 ? '.' : ''}${i}`)).join('')

export const pathArrayToJsonPointer = (array: string[]) => `/${array.join('/')}`

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target: any, ...sources: any): any {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

export const mergePath = (target: any, newState: any) => {
  if (!newState || typeof newState !== 'object') return target
  const newTarget = cloneDeep(target)
  Object.entries(newState).forEach(([key, value]) => {
    jsonpointer.set(newTarget, key, value)
  })
  return newTarget
}

// eslint-disable-next-line import/prefer-default-export
export const changeRelativePath = (path: string) => {
  let pathArray = path.split(c.SEPARATOR)
  if (pathArray && pathArray.length > 1 && pathArray[pathArray.length - 1] === '') {
    pathArray.pop()
  }
  const absolutepathIndex = findLastIndex(pathArray, (i) => i === '')
  if (absolutepathIndex > 0) {
    pathArray = drop(pathArray, absolutepathIndex)
  }
  pathArray = pull(pathArray, '.')
  let count = 0
  let relativepathIndex = -1
  do {
    count += 1
    relativepathIndex = findIndex(pathArray, (i) => i === '..')
    if (relativepathIndex !== -1) {
      unset(pathArray, `[${relativepathIndex}]`)
      unset(pathArray, `[${relativepathIndex - 1}]`)
      pathArray = compact(pathArray)
    }
  } while (relativepathIndex !== -1 && count < 100)
  return pathArray.join(c.SEPARATOR)
}

// changeRelativePath('111/22222/3333/./anything/../../start')

const genStyle = (props: PropsType) => {
  const { parentComp } = props
  const style = { display: 'flex', flexDirection: 'column', ...(props.style as any), ...(props[c.STYLE_WEB_NAME] as any) }

  if (style && style.borderWidth && !style.borderStyle) {
    style.borderStyle = 'solid'
  }
  if (style && style.flex) {
    if (
      parentComp &&
      (parentComp as any).style &&
      (parentComp as any).style.flex &&
      (parentComp as any).style.flex < 1
      // if smaller or larger, noesn't matter
    ) {
      style.height = `100%`
      style.width = `100%`
    } else if (!style.height) {
      style.height = `${style.flex * 100}%`
    }
  }
  return style
}
export const getStyleForWeb = (props: PropsType = {}, component: string) =>
  component === 'View' ? genStyle(props) : { ...(props.style as any), ...(props[c.STYLE_WEB_NAME] as any) }

// TODO it have to be configurable
export const noChildren = (component: string) => ['Image'].includes(component)

export const isNumber = (a: any) => typeof a === 'number'
