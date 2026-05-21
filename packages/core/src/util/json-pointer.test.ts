import { describe, it, expect } from 'vitest'
import { normalizePath, parsePath, get, set, resolvePath } from './json-pointer.js'
import { JSON_SEPARATOR } from './contants.js'
import { JSONParams } from './types.js'

describe('json-pointer utilities', () => {
  describe('normalizePath', () => {
    it('returns root for empty or root-like paths', () => {
      expect(normalizePath('')).toBe(JSON_SEPARATOR)
      expect(normalizePath('/')).toBe(JSON_SEPARATOR)
      expect(normalizePath('////')).toBe(JSON_SEPARATOR)
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

    it('preserves empty reference tokens', () => {
      expect(parsePath('/a/')).toEqual(['a', ''])
      expect(parsePath('//')).toEqual(['', ''])
    })

    it('rejects non-absolute pointer strings', () => {
      expect(() => parsePath('a/b')).toThrow('Invalid JSON Pointer path')
    })

    it('throws on invalid escape sequences', () => {
      expect(() => parsePath('/a/~2b')).toThrow('Invalid JSON Pointer escape')
      expect(() => parsePath('/a/~')).toThrow('Invalid JSON Pointer escape')
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
      const obj: JSONParams = {}
      set(obj, '/a/b/c', 1)
      expect(obj).toEqual({ a: { b: { c: 1 } } })
    })

    it('overwrites non-object parents when descending', () => {
      const obj: JSONParams = { a: 1 }
      set(obj, '/a/b', 2)
      expect(obj).toEqual({ a: { b: 2 } })
    })

    it('writes to arrays when numeric segments are used', () => {
      const obj: JSONParams = {}
      set(obj, '/items/0', 'x')
      set(obj, '/items/1', 'y')
      expect(obj).toEqual({ items: ['x', 'y'] })
    })

    it('treats leading-zero numeric-looking keys as object keys', () => {
      const obj: JSONParams = {}
      set(obj, '/items/01/value', 1)
      expect(obj).toEqual({ items: { '01': { value: 1 } } })
    })

    it('rejects unsafe prototype segments', () => {
      const obj: JSONParams = {}
      expect(() => set(obj, '/__proto__/polluted', true)).toThrow('Unsafe JSON Pointer segment')
      expect(() => set(obj, '/safe/constructor', true)).toThrow('Unsafe JSON Pointer segment')
      expect(({} as JSONParams).polluted).toBeUndefined()
    })

    it('rejects non-numeric final segment when writing to arrays', () => {
      const obj: JSONParams = { items: [] }
      expect(() => set(obj, '/items/foo', 'x')).toThrow('Invalid array index segment')
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

    it('does not double-escape already escaped relative tokens', () => {
      expect(resolvePath('/a', '~1b')).toBe('/a/~1b')
      expect(resolvePath('/a', 'x~0y')).toBe('/a/x~0y')
    })
  })
})
