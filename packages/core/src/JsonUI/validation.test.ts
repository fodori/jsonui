import { describe, it, expect } from 'vitest'
import { buildValidationRegistry, runInlineValidation, runValidationsForPath } from './validation.js'
import { Store } from '../store/store.js'
import { InlineValidationSpec, ValidationRule } from '../util/types.js'

describe('JsonUI validation helpers', () => {
  describe('buildValidationRegistry', () => {
    it('returns empty registry for undefined or empty rules', () => {
      expect(buildValidationRegistry(undefined)).toEqual({})
      expect(buildValidationRegistry([])).toEqual({})
    })

    it('creates Ajv validators grouped by store and path', () => {
      const rules: ValidationRule[] = [
        {
          store: 'data',
          path: '/user/name',
          schema: { type: 'string', minLength: 2 },
        },
      ]
      const registry = buildValidationRegistry(rules)
      expect(Object.keys(registry)).toEqual(['data'])
      const dataValidators = registry.data
      expect(dataValidators).toBeDefined()
      if (!dataValidators) throw new Error('expected data validators')
      expect(Object.keys(dataValidators)).toEqual(['/user/name'])
      expect(dataValidators['/user/name']).toHaveLength(1)
    })
  })

  describe('runInlineValidation', () => {
    it('writes error messages into the corresponding error store', () => {
      const store = new Store()
      store.setForStore('data', '/user/age', 15)
      const spec: InlineValidationSpec = {
        store: 'data',
        path: '/user/age',
        schema: { type: 'number', minimum: 18 },
      }

      runInlineValidation(spec, store, '/')

      const error = store.getForStore('data.error', '/user/age')
      expect(typeof error).toBe('string')
      expect(String(error).length).toBeGreaterThan(0)
    })

    it('clears existing error when value becomes valid', () => {
      const store = new Store()
      store.setForStore('data', '/user/age', 15)
      const spec: InlineValidationSpec = {
        store: 'data',
        path: '/user/age',
        schema: { type: 'number', minimum: 18 },
      }
      runInlineValidation(spec, store, '/')
      expect(store.getForStore('data.error', '/user/age')).toBeDefined()

      // Make value valid and rerun
      store.setForStore('data', '/user/age', 20)
      runInlineValidation(spec, store, '/')
      expect(store.getForStore('data.error', '/user/age')).toBeNull()
    })
  })

  describe('runValidationsForPath', () => {
    it('runs all matching rules whose paths are prefixes of the given path', () => {
      const rules: ValidationRule[] = [
        {
          store: 'data',
          path: '/',
          schema: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 2 },
                },
              },
            },
          },
        },
      ]

      const registry = buildValidationRegistry(rules)
      const store = new Store()
      store.setForStore('data', '/user/name', '')

      runValidationsForPath(registry, store, 'data', '/user/name')

      const error = store.getForStore('data.error', '/user/name')
      expect(typeof error).toBe('string')
      expect(String(error).length).toBeGreaterThan(0)
    })

    it('clears errors when previously invalid values become valid', () => {
      const rules: ValidationRule[] = [
        {
          store: 'data',
          path: '/players',
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                score: { type: 'number', minimum: 0 },
              },
            },
          },
        },
      ]

      const registry = buildValidationRegistry(rules)
      const store = new Store()
      store.setForStore('data', '/players', [{ score: -1 }])

      runValidationsForPath(registry, store, 'data', '/players/0/score')
      expect(store.getForStore('data.error', '/players/0/score')).toBeDefined()

      // Fix the score and rerun
      store.setForStore('data', '/players/0/score', 10)
      runValidationsForPath(registry, store, 'data', '/players/0/score')
      expect(store.getForStore('data.error', '/players/0/score')).toBeNull()
    })
  })
})
