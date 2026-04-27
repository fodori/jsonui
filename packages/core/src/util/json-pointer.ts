/**
 * Minimal JSON Pointer implementation (RFC 6901).
 * Supports get, set, and path resolution (absolute, relative, ./ ../).
 *
 * Paths and nesting are unbounded: e.g. /a/b/c/0/d/e/1/f is valid;
 * segments can be object keys or array indices (numeric strings).
 */

import { JSON_SEPARATOR } from './contants'

/**
 * Normalize a path: remove empty segments and trailing/leading slashes.
 * Prevents accidental keys like "" from paths such as "//" or "/a/".
 * Does not decode segments (e.g. ~1 stays so one segment is preserved).
 */
export function normalizePath(pathStr: string): string {
  if (!pathStr || pathStr === '/') return '/'
  const trimmed = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr
  const segments = trimmed.split(JSON_SEPARATOR).filter((s) => s !== '')
  return segments.length === 0 ? '/' : JSON_SEPARATOR + segments.join(JSON_SEPARATOR)
}

export function parsePath(pathStr: string): string[] {
  const normalized = normalizePath(pathStr)
  if (normalized === '/') return []
  return normalized.slice(1).split(JSON_SEPARATOR).map(decode)
}

function decode(segment: string): string {
  return segment.replace(/~1/g, '/').replace(/~0/g, '~')
}

function encode(segment: string): string {
  return String(segment).replace(/~/g, '~0').replace(/\//g, '~1')
}

export function get(obj: unknown, pathStr: string): unknown {
  const segments = parsePath(pathStr) // parsePath normalizes, so /a//b/ -> /a/b
  let current: unknown = obj
  for (const seg of segments) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[seg]
  }
  return current
}

export function set(obj: Record<string, unknown>, pathStr: string, value: unknown): void {
  const segments = parsePath(pathStr)
  if (segments.length === 0) return

  let current: Record<string, unknown> = obj
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i]
    const nextSeg = segments[i + 1]
    const nextKey = nextSeg === '' || /^\d+$/.test(nextSeg) ? parseInt(nextSeg, 10) : nextSeg

    if (!(seg in current) || current[seg] == null) {
      current[seg] = typeof nextKey === 'number' ? [] : {}
    }
    const next = current[seg]
    if (typeof next !== 'object' || next === null) {
      current[seg] = typeof nextKey === 'number' ? [] : {}
    }
    current = current[seg] as Record<string, unknown>
  }

  const lastSeg = segments[segments.length - 1]
  const lastKey = lastSeg === '' || /^\d+$/.test(lastSeg) ? parseInt(lastSeg, 10) : lastSeg
  if (Array.isArray(current)) {
    ;(current as unknown[])[lastKey as number] = value
  } else {
    current[lastSeg] = value
  }
}

/**
 * Resolve a path against a base path (for relative paths like ./x, ../y).
 * Supports arbitrary depth; excess ".." yields root then appends remaining segments.
 */
export function resolvePath(basePath: string, relativePath: string): string {
  if (relativePath.startsWith('/')) return relativePath

  const baseSegments = parsePath(basePath)
  const relSegments = relativePath.split(JSON_SEPARATOR).filter(Boolean)

  for (const seg of relSegments) {
    if (seg === '..') {
      baseSegments.pop()
    } else if (seg !== '.') {
      baseSegments.push(seg)
    }
  }

  return JSON_SEPARATOR + baseSegments.map(encode).join(JSON_SEPARATOR)
}
