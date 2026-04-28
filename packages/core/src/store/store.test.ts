import { describe, it, expect, vi } from 'vitest'
import { Store, createStores, getRootStore, makeStorePath, resolveStorePath, type StoreMap } from './store.js'
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

  describe('createStores & getRootStore', () => {
    it('creates stores with initial state', () => {
      const stores = createStores({ data: { x: 1 } })
      expect(stores.data.get('/x')).toEqual(1)
    })

    it('getRootStore creates default root when none exists', () => {
      const stores: StoreMap = {}
      const root = getRootStore(stores)
      expect(root).toBeInstanceOf(Store)
      // Calling again should return the same instance.
      expect(getRootStore(stores)).toBe(root)
    })
  })

  describe('Store basic operations', () => {
    it('get/set work with JSON Pointer paths and return deep clones', () => {
      const store = new Store()
      store.set('/a/b', { c: 1 })
      const value = store.get('/a/b') as { c: number }
      expect(value).toEqual({ c: 1 })

      // Mutating the returned value must not affect internal state.
      value.c = 2
      expect(store.get('/a/b')).toEqual({ c: 1 })
    })

    it('update reads current value and writes transformed value', () => {
      const store = new Store()
      store.set('/count', 1)
      store.update('/count', (current) => (current as number) + 1)
      expect(store.get('/count')).toBe(2)
    })

    it('subscribe is notified on set and replaceState', () => {
      const store = new Store()
      const listener = vi.fn()
      const unsubscribe = store.subscribe(listener)

      store.set('/a', 1)
      store.replaceState({})

      expect(listener).toHaveBeenCalledTimes(2)

      unsubscribe()
      store.set('/b', 2)
      expect(listener).toHaveBeenCalledTimes(2)
    })
  })

  describe('setForStore / getForStore / change listeners', () => {
    it('isolates logical stores under STORE_ROOT_PATH and tracks touched paths', () => {
      const store = new Store()
      const changes: Array<{ name: string; path: string }> = []
      store.subscribeChange((name, path) => {
        changes.push({ name, path })
      })

      store.setForStore('data', '/user/name', 'Alice')

      // Main store value
      expect(store.getForStore('data', '/user/name')).toBe('Alice')
      // Touched store value (created automatically)
      expect(store.getForStore('data.touch', '/user/name')).toBe(true)

      // Change listener receives logical store name and path
      expect(changes).toEqual([{ name: 'data', path: '/user/name' }])
    })

    it('does not create touched entries when writing into touch/error stores', () => {
      const store = new Store()
      store.setForStore('data.touch', '/user/name', true)
      expect(store.getForStore('data.touch.touch', '/user/name')).toBeUndefined()
    })
  })

  describe('getLogicalStoresMap', () => {
    it('returns the same shape as JsonUI defaultValues (no storeRoot wrapper)', () => {
      const store = new Store()
      store.setForStore('data', '/x', 1)
      const logical = store.getLogicalStoresMap()
      expect(logical.data).toEqual({ x: 1 })
      expect((logical as Record<string, unknown>)['data.touch']).toEqual({ x: true })
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
