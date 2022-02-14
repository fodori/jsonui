import traverse from 'traverse'
import uniq from 'lodash/uniq'
import compact from 'lodash/compact'
import unset from 'lodash/unset'
import findIndex from 'lodash/findIndex'
import pull from 'lodash/pull'
import defaultsDeep from 'lodash/defaultsDeep'
import * as c from './constants'

export const collectJsonKeys = (refConst: string, json: any) => {
  const refs: any[] = []
  // eslint-disable-next-line func-names
  traverse(json).forEach(function (x) {
    if (x && x[refConst] && !!this && !this.circular) {
      refs.push(x[refConst])
    }
  })
  const res = {}
  uniq(compact(refs)).forEach((i) => defaultsDeep(res, i))
  return res
}

const isFullPath = (path?: string) => {
  if (!!path && typeof path === 'string') {
    const regex = /^[A-Za-z]*:\/\//
    return regex.test(path)
  }
  return false
}

const isRelativePath = (path?: string) => !!path && typeof path === 'string' && !isFullPath(path) && !path.startsWith(c.SEPARATOR) // if not full and not start with /

const isRootPath = (path?: string) => !!path && typeof path === 'string' && !isFullPath(path) && path.startsWith(c.SEPARATOR) // if not full and start with /

const changeRelativePath = (path: string) => {
  let pathArray = path.split(c.SEPARATOR)
  pathArray = pull(pathArray, '.') // remove all ./
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

// TODO: just workaround, not works with http://localhost for example
const getRoot = (url3?: string) => {
  if (!!url3 && typeof url3 === 'string') {
    const regex = /^([A-Za-z]*:\/\/[^/]*)(\/|)/
    const found = url3.match(regex)
    if (found) {
      return `${found[1]}/`
    }
  }
  return null
}

// console.error('test',isFullPath('asdasd://'))
export const getRefs = (refConst: string, json: any, projectPath = '') => {
  const refs: any[] = []
  // eslint-disable-next-line func-names
  traverse(json).forEach(function (x) {
    if (x && x[refConst] && !!this && !this.circular) {
      const ref = x[refConst]
      let absolutePath
      // TODO: If the projectPath is absolute, will be wrong
      if (isRootPath(ref)) {
        const root = getRoot(projectPath)
        absolutePath = changeRelativePath(`${root}${ref}`)
      } else if (isRelativePath(ref)) {
        absolutePath = changeRelativePath(`${projectPath}${ref}`)
      } else {
        absolutePath = ref
      }
      // eslint-disable-next-line no-param-reassign
      x[refConst] = absolutePath
      refs.push(absolutePath)
    }
  })
  // console.warn(refs);
  return uniq(compact(refs))
}
