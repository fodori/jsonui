import { describe, it, expect } from 'vitest'
import { FormStore, makeStorePath, resolveStorePath } from './formStore.js'
import { STORE_ROOT_PATH } from '../util/contants.js'

describe('Store core API', () => {
  describe('makeStorePath', () => {
    it('throws for empty store name', () => {
      expect(() => makeStorePath('', '/a')).toThrow()
    })

    it('builds base path when logical path is root', () => {
      expect(makeStorePath('data', '/')).toBe(`${STORE_ROOT_PATH}/data`)
      expect(makeStorePath('data', '')).toBe(`${STORE_ROOT_PATH}/data`)
    })

    it('builds base path when logical path is root', () => {
      expect(makeStorePath('differentName', '/')).toBe(`${STORE_ROOT_PATH}/differentName`)
      expect(makeStorePath('differentName', '')).toBe(`${STORE_ROOT_PATH}/differentName`)
    })

    it('normalizes nested logical paths', () => {
      expect(makeStorePath('data', 'a/b')).toBe(`${STORE_ROOT_PATH}/data/a/b`)
      expect(makeStorePath('data', '/a//b/')).toBe(`${STORE_ROOT_PATH}/data/a/b`)
    })
  })

  describe('Store state access and initialization', () => {
    it('initializeStore writes only to the selected logical store', () => {
      const store = new FormStore()

      store.initializeStore('data', { name: 'fred' })

      expect(store.get('data', '/name')).toBe('fred')
      expect(store.get('data.touch', '/name')).toBeUndefined()
      expect(store.get('anotherstore', '/name')).toBeUndefined()
    })

    it('getState returns a defensive clone', () => {
      const store = new FormStore()
      store.initializeStore('data', { profile: { name: 'Alice' } })

      const snapshot = store.getState() as { storeRoot: { data: { profile: { name: string } } } }
      snapshot.storeRoot.data.profile.name = 'Tampered'

      expect(store.get('data', '/profile/name')).toBe('Alice')
    })
  })

  describe('set / get / change listeners', () => {
    it('isolates logical stores under STORE_ROOT_PATH and tracks touched paths', () => {
      const store = new FormStore()
      const changes: Array<{ name: string; path: string }> = []
      store.subscribeChange((name, path) => {
        changes.push({ name, path })
      })

      store.set('data', '/user/name', 'Alice')

      // Main store value
      expect(store.get('data', '/user/name')).toBe('Alice')
      // Touched store value (created automatically)
      expect(store.get('data.touch', '/user/name')).toBe(true)

      // Change listener receives logical store name and path
      expect(changes).toEqual([{ name: 'data', path: '/user/name' }])
    })

    it('does not create touched entries when writing into touch/error stores', () => {
      const store = new FormStore()
      store.set('data.touch', '/user/name', true)
      expect(store.get('data.touch.touch', '/user/name')).toBeUndefined()
    })
  })

  describe('getLogicalStoresMap', () => {
    it('returns the same shape as JsonUI defaultValues (no storeRoot wrapper)', () => {
      const store = new FormStore()
      store.set('data', '/x', 1)
      const logical = store.getLogicalStoresMap()
      expect(logical.data).toEqual({ x: 1 })
      expect(logical['data.touch']).toEqual({ x: true })
      expect(store.getState().storeRoot).toBeDefined()
    })
  })

  describe('resolveStorePath', () => {
    it('returns absolute paths unchanged (normalized)', () => {
      expect(resolveStorePath('/a//b/', '/ignored')).toBe('/a/b')
    })

    it('normalizes absolute paths with trailing slash', () => {
      expect(resolveStorePath('/a/b/', '/ignored')).toBe('/a/b')
    })

    it('resolves relative paths against currentPath when no modifier', () => {
      expect(resolveStorePath('c', '/a/b')).toBe('/a/b/c')
    })

    it('resolves relative path against root currentPath', () => {
      expect(resolveStorePath('name', '/')).toBe('/name')
    })

    it('uses pathModifiers for matching store when present', () => {
      const pathModifiers = { data: { path: '/items/0' } }
      expect(resolveStorePath('score', '/a/b', pathModifiers, 'data')).toBe('/items/0/score')
    })

    it('ignores pathModifiers when storeName does not match', () => {
      const pathModifiers = { data: { path: '/items/0' } }
      expect(resolveStorePath('score', '/a/b', pathModifiers, 'other')).toBe('/a/b/score')
    })

    it('ignores pathModifiers when storeName is undefined', () => {
      const pathModifiers = { data: { path: '/items/0' } }
      expect(resolveStorePath('score', '/a/b', pathModifiers, undefined)).toBe('/a/b/score')
    })

    it('falls back to currentPath when pathModifiers is undefined', () => {
      expect(resolveStorePath('field', '/parent', undefined, 'data')).toBe('/parent/field')
    })

    it('handles absolute path when pathModifiers are provided for different store', () => {
      const pathModifiers = { data: { path: '/items/0' } }
      expect(resolveStorePath('/abs/path', '/current', pathModifiers, 'other')).toBe('/abs/path')
    })
  })
})
