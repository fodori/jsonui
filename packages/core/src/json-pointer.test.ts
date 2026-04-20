import { describe, it, expect } from 'vitest'
import { normalizePath, parsePath, get, set, resolvePath, SEPARATOR } from './json-pointer.js'

describe('json-pointer utilities', () => {
  describe('normalizePath', () => {
    it('returns root for empty or root-like paths', () => {
      expect(normalizePath('')).toBe(SEPARATOR)
      expect(normalizePath('/')).toBe(SEPARATOR)
      expect(normalizePath('////')).toBe(SEPARATOR)
    })

    it('removes duplicate, leading and trailing slashes', () => {
      expect(normalizePath('/a//b/')).toBe('/a/b')
      expect(normalizePath('a/b')).toBe('/a/b')
    })
  })

  describe('parsePath', () => {
    it('returns empty array for root path', () => {
      expect(parsePath('/')).toEqual([])
    })

    it('splits normalized segments and decodes tokens', () => {
      expect(parsePath('/a/b')).toEqual(['a', 'b'])
      expect(parsePath('/foo~0bar~1baz')).toEqual(['foo~bar/baz'])
    })
  })

  describe('get', () => {
    it('returns undefined when traversing through non-objects', () => {
      expect(get(123, '/a')).toBeUndefined()
    })

    it('reads nested object values', () => {
      const obj = { a: { b: { c: 1 } } }
      expect(get(obj, '/a/b/c')).toBe(1)
    })
  })

  describe('set', () => {
    it('creates nested objects when missing', () => {
      const obj: Record<string, unknown> = {}
      set(obj, '/a/b/c', 1)
      expect(obj).toEqual({ a: { b: { c: 1 } } })
    })

    it('overwrites non-object parents when descending', () => {
      const obj: Record<string, unknown> = { a: 1 }
      set(obj, '/a/b', 2)
      expect(obj).toEqual({ a: { b: 2 } })
    })

    it('writes to arrays when numeric segments are used', () => {
      const obj: Record<string, unknown> = {}
      set(obj, '/items/0', 'x')
      set(obj, '/items/1', 'y')
      expect(obj).toEqual({ items: ['x', 'y'] })
    })
  })

  describe('resolvePath', () => {
    it('returns absolute path unchanged', () => {
      expect(resolvePath('/a/b', '/c')).toBe('/c')
    })

    it('resolves simple relative segments', () => {
      expect(resolvePath('/a/b', 'c')).toBe('/a/b/c')
    })

    it('supports "." and ".." segments', () => {
      expect(resolvePath('/a/b/c', './d')).toBe('/a/b/c/d')
      expect(resolvePath('/a/b/c', '../d')).toBe('/a/b/d')
    })

    it('does not go above root when using many ".."', () => {
      expect(resolvePath('/a/b', '../../../c')).toBe('/c')
    })
  })
})
