/**
 * Minimal JSON Pointer implementation (RFC 6901).
 * Supports get, set, and path resolution (absolute, relative, ./ ../).
 *
 * Paths and nesting are unbounded: e.g. /a/b/c/0/d/e/1/f is valid;
 * segments can be object keys or array indices (numeric strings).
 */

import { JSON_SEPARATOR } from './contants'
import { JSONParams } from './types'

const DANGEROUS_KEYS = new Set(['__proto__', 'prototype', 'constructor'])

/**
 * Normalize a path: remove empty segments and trailing/leading slashes.
 * Prevents accidental keys like "" from paths such as "//" or "/a/".
 * Does not decode segments (e.g. ~1 stays so one segment is preserved).
 */
export const normalizePath = (pathStr: string): string => {
  if (!pathStr || pathStr === '/') return '/'
  const trimmed = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr
  const segments = trimmed.split(JSON_SEPARATOR).filter((s) => s !== '')
  return segments.length === 0 ? '/' : JSON_SEPARATOR + segments.join(JSON_SEPARATOR)
}

export const parsePath = (pathStr: string): string[] => {
  if (!pathStr || pathStr === '/') return []
  if (!pathStr.startsWith(JSON_SEPARATOR)) {
    throw new Error(`Invalid JSON Pointer path: ${pathStr}`)
  }
  return pathStr.slice(1).split(JSON_SEPARATOR).map(decode)
}

const decode = (segment: string): string => {
  for (let i = 0; i < segment.length; i++) {
    if (segment[i] === '~') {
      const next = segment[i + 1]
      if (next !== '0' && next !== '1') {
        throw new Error(`Invalid JSON Pointer escape in segment: ${segment}`)
      }
      i += 1
    }
  }
  return segment.replace(/~1/g, '/').replace(/~0/g, '~')
}

const encode = (segment: string): string => {
  return String(segment).replace(/~/g, '~0').replace(/\//g, '~1')
}

export const get = (obj: unknown, pathStr: string): unknown => {
  const segments = parsePath(pathStr) // parsePath normalizes, so /a//b/ -> /a/b
  let current: unknown = obj
  for (const seg of segments) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as JSONParams)[seg]
  }
  return current
}

export const set = (obj: JSONParams, pathStr: string, value: unknown): void => {
  const segments = parsePath(pathStr)
  if (segments.length === 0) return

  let current: JSONParams = obj
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i]
    if (DANGEROUS_KEYS.has(seg)) {
      throw new Error(`Unsafe JSON Pointer segment: ${seg}`)
    }

    const nextSeg = segments[i + 1]
    const nextKey = isArrayIndexToken(nextSeg) ? parseInt(nextSeg, 10) : nextSeg

    if (!(seg in current) || current[seg] == null) {
      current[seg] = typeof nextKey === 'number' ? [] : {}
    }
    const next = current[seg]
    if (typeof next !== 'object' || next === null) {
      current[seg] = typeof nextKey === 'number' ? [] : {}
    }
    current = current[seg] as JSONParams
  }

  const lastSeg = segments[segments.length - 1]
  if (DANGEROUS_KEYS.has(lastSeg)) {
    throw new Error(`Unsafe JSON Pointer segment: ${lastSeg}`)
  }

  const lastKey = isArrayIndexToken(lastSeg) ? parseInt(lastSeg, 10) : lastSeg
  if (Array.isArray(current)) {
    if (typeof lastKey !== 'number') {
      throw new Error(`Invalid array index segment: ${lastSeg}`)
    }
    ;(current as unknown[])[lastKey] = value
  } else {
    current[lastSeg] = value
  }
}

/**
 * Resolve a path against a base path (for relative paths like ./x, ../y).
 * Supports arbitrary depth; excess ".." yields root then appends remaining segments.
 */
export const resolvePath = (basePath: string, relativePath: string): string => {
  if (relativePath.startsWith('/')) return normalizePath(relativePath)

  const baseSegments = parsePath(basePath)
  const relSegments = relativePath.split(JSON_SEPARATOR).filter(Boolean)

  for (const seg of relSegments) {
    if (seg === '..') {
      baseSegments.pop()
    } else if (seg !== '.') {
      baseSegments.push(decode(seg))
    }
  }

  return JSON_SEPARATOR + baseSegments.map(encode).join(JSON_SEPARATOR)
}

const isArrayIndexToken = (token: string): boolean => {
  if (token.length === 0) return false
  if (token === '0') return true
  return /^[1-9]\d*$/.test(token)
}
