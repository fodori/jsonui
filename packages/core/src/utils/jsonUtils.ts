import jsonpointer from 'jsonpointer'
import cloneDeep from 'lodash/cloneDeep'
import findIndex from 'lodash/findIndex'
import pull from 'lodash/pull'
import traverse from 'traverse'
import * as c from './constants'

export const findLastIndex = (arr: any[], func: any) => {
  const reverseIdx = [...arr].reverse().findIndex(func)
  return reverseIdx === -1 ? reverseIdx : arr.length - (reverseIdx + 1)
}

export const drop = (arr: any[], n = 1) => arr.slice(n)

export const isNumber = (a: any) => typeof a === 'number'

export const jsonPointerFix = (path?: string) => {
  if (path !== null && path !== undefined && typeof path === 'string') {
    let str = path
    str = str.charAt(str.length - 1) === c.SEPARATOR ? str.slice(0, -1) : str
    str = str.startsWith(c.SEPARATOR) ? str : `${c.SEPARATOR}${str}`
    return str
  }
  return c.SEPARATOR
}

export const jsonPointerGet = (json: any, path?: string) => {
  if (json === undefined || path === null || path === undefined || typeof path !== 'string') return undefined
  if (path === c.SEPARATOR /* || path === '' same effect */) return json
  try {
    return jsonpointer.get(json, jsonPointerFix(path))
  } catch {
    return undefined
  }
}

export const jsonPointerSet = (json: any, path?: string, value?: any) => {
  if (json === undefined || path === null || path === undefined || typeof path !== 'string') return json
  if (path === c.SEPARATOR || path === '') {
    return value
  }
  try {
    jsonpointer.set(json, jsonPointerFix(path), value)
    return json
    // eslint-disable-next-line no-empty
  } catch {
    return json
  }
}

export const pathArrayToPathString = (array: (string | number)[]) =>
  array.map((i, index) => (Number.isInteger(i) ? `[${i}]` : `${index > 0 ? '.' : ''}${i}`)).join('')

export const pathArrayToJsonPointer = (array: (string | number)[]) => `/${array.join('/')}`

export function isOnlyObject(item: any): boolean {
  return !!item && typeof item === 'object' && !Array.isArray(item)
}

export const mergePath = (target: any, newState: any) => {
  if (!newState || typeof newState !== 'object') return target
  let newTarget = cloneDeep(target)
  Object.entries(newState).forEach(([key, value]) => {
    newTarget = jsonPointerSet(newTarget, key, value)
  })
  return newTarget
}

// eslint-disable-next-line import/prefer-default-export
export const changeRelativePath = (path: string) => {
  let pathArray = path.split(c.SEPARATOR)
  // remove last /
  if (pathArray && pathArray.length > 1 && pathArray[pathArray.length - 1] === '' && !(pathArray.length === 2 && pathArray[0] === '')) {
    pathArray.pop()
  }
  // the last / is meaningful
  const absolutepathIndex = findLastIndex(pathArray, (i: string) => i === '')
  if (absolutepathIndex > 0) {
    pathArray = drop(pathArray, absolutepathIndex)
  }
  // all . need to remove because is just pointing the prev level
  pathArray = pull(pathArray, '.')
  let count = 0
  let relativepathIndex = -1
  do {
    count += 1
    relativepathIndex = findIndex(pathArray, (i) => i === '..')
    if (relativepathIndex !== -1) {
      pathArray.splice(relativepathIndex, 1)
      pathArray.splice(relativepathIndex - 1, 1)
    }
  } while (relativepathIndex !== -1 && count < 100)
  pathArray = pull(pathArray, '..')
  if (pathArray.length === 1 && pathArray[0] !== '') {
    pathArray = ['', ...pathArray]
  }
  return pathArray.join(c.SEPARATOR)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target: any, ...sources: any): any {
  if (!sources.length) return target
  const source = sources.shift()

  if (isOnlyObject(target) && isOnlyObject(source)) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in source) {
      if (isOnlyObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

export const collectObjMerge = (refConst: string, json: any) => {
  const res = {}
  if (refConst && json && typeof json === 'object') {
    const refs: any[] = []
    // eslint-disable-next-line func-names
    traverse(json).forEach(function (x) {
      if (x && !!x[refConst] && !!this && !this.circular) {
        refs.push(x[refConst])
      }
    })
    refs.filter((i) => !!i).forEach((i) => mergeDeep(res, i))
  }
  return res
}

export const collectObjToArray = (refConst: string, json: any, flatten = false) => {
  if (refConst && json && typeof json === 'object') {
    const refs: any[] = []
    // eslint-disable-next-line func-names
    traverse(json).forEach(function (x) {
      if (x && !!x[refConst] && !!this && !this.circular) {
        refs.push(x[refConst])
      }
    })
    return flatten === true ? refs.flat() : refs
  }
  return []
}

export const isValidJson = (d: any): boolean => {
  try {
    JSON.stringify(d)
  } catch {
    return false
  }
  return true
}

export const isPrimitiveValue = (value: any, emptyStringAllowed = false) =>
  value !== 'undefined' && value !== null && ['string', 'boolean', 'number', 'bigint'].includes(typeof value) && (value !== '' || emptyStringAllowed)

export const hasLeaf = (obj: any, emptyStringAllowed?: boolean): boolean => {
  if (typeof obj === 'object') {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        if (typeof value === 'object') {
          return hasLeaf(value)
        }
        return isPrimitiveValue(value, emptyStringAllowed)
      }
    }
  }
  return isPrimitiveValue(obj, emptyStringAllowed)
}
