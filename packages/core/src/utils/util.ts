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

// TODO it have to be configurable
export const noChildren = (component: string) => ['Image'].includes(component)

export const isNumber = (a: any) => typeof a === 'number'

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

export const pathArrayToPathString = (array: (string | number)[]) =>
  array.map((i, index) => (Number.isInteger(i) ? `[${i}]` : `${index > 0 ? '.' : ''}${i}`)).join('')

export const pathArrayToJsonPointer = (array: (string | number)[]) => `/${array.join('/')}`

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
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

export const collectObjToArray = (refConst: string, json: any) => {
  if (refConst && json && typeof json === 'object') {
    const refs: any[] = []
    // eslint-disable-next-line func-names
    traverse(json).forEach(function (x) {
      if (x && !!x[refConst] && !!this && !this.circular) {
        refs.push(x[refConst])
      }
    })
    return refs
  }
  return []
}
