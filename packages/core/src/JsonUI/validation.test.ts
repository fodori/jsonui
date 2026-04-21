import { describe, it, expect } from 'vitest'
import { buildValidationRegistry, runInlineValidation, runValidationsForPath } from './validation.js'
import { Store, getRootStore } from '../store.js'
import type { InlineValidationSpec, ValidationRule } from './validation.js'

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
      const stores: Record<string, Store> = {}
      const root = getRootStore(stores)
      root.setForStore('data', '/user/age', 15)
      const spec: InlineValidationSpec = {
        store: 'data',
        path: '/user/age',
        schema: { type: 'number', minimum: 18 },
      }

      runInlineValidation(spec, stores, '/')

      const error = root.getForStore('data.error', '/user/age')
      expect(typeof error).toBe('string')
      expect(String(error).length).toBeGreaterThan(0)
    })

    it('clears existing error when value becomes valid', () => {
      const stores: Record<string, Store> = {}
      const root = getRootStore(stores)
      root.setForStore('data', '/user/age', 15)
      const spec: InlineValidationSpec = {
        store: 'data',
        path: '/user/age',
        schema: { type: 'number', minimum: 18 },
      }
      runInlineValidation(spec, stores, '/')
      expect(root.getForStore('data.error', '/user/age')).toBeDefined()

      // Make value valid and rerun
      root.setForStore('data', '/user/age', 20)
      runInlineValidation(spec, stores, '/')
      expect(root.getForStore('data.error', '/user/age')).toBeUndefined()
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
      const stores: Record<string, Store> = {}
      const root = getRootStore(stores)
      root.setForStore('data', '/user/name', '')

      runValidationsForPath(registry, stores, 'data', '/user/name')

      const error = root.getForStore('data.error', '/user/name')
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
      const stores: Record<string, Store> = {}
      const root = getRootStore(stores)
      root.setForStore('data', '/players', [{ score: -1 }])

      runValidationsForPath(registry, stores, 'data', '/players/0/score')
      expect(root.getForStore('data.error', '/players/0/score')).toBeDefined()

      // Fix the score and rerun
      root.setForStore('data', '/players/0/score', 10)
      runValidationsForPath(registry, stores, 'data', '/players/0/score')
      expect(root.getForStore('data.error', '/players/0/score')).toBeUndefined()
    })
  })
})
