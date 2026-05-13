import { describe, it, expect } from 'vitest'
import { buildValidationRegistry, runInlineValidation, runValidationsForPath } from './validation.js'
import { Store } from '../store/store.js'
import { InlineValidationSpec, ModifierContext, ModifierMap, ValidationRule } from '../util/types.js'

const noopModifiers: ModifierMap = {}
const makeCtx = (store: Store): ModifierContext => ({
  store,
  currentPath: '/',
})

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
    describe('schema-based', () => {
      it('writes error messages into the corresponding error store', async () => {
        const store = new Store()
        store.setForStore('data', '/user/age', 15)
        const spec: InlineValidationSpec = {
          schema: { type: 'number', minimum: 18 },
        }

        await runInlineValidation(spec, store, 'data', '/user/age', noopModifiers, makeCtx(store))

        const error = store.getForStore('data.error', '/user/age')
        expect(typeof error).toBe('string')
        expect(String(error).length).toBeGreaterThan(0)
      })

      it('clears existing error when value becomes valid', async () => {
        const store = new Store()
        store.setForStore('data', '/user/age', 15)
        const spec: InlineValidationSpec = {
          schema: { type: 'number', minimum: 18 },
        }
        await runInlineValidation(spec, store, 'data', '/user/age', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/user/age')).toBeDefined()

        store.setForStore('data', '/user/age', 20)
        await runInlineValidation(spec, store, 'data', '/user/age', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/user/age')).toBeNull()
      })
    })

    describe('jsonataDef-based', () => {
      it('sets plain string errorMessage when JSONata expression returns truthy non-boolean', async () => {
        const store = new Store()
        store.setForStore('data', '/score', 5)
        const spec: InlineValidationSpec = {
          jsonataDef: '$ < 10 ? "too low" : null',
          errorMessage: 'Should be at least 10',
        }

        await runInlineValidation(spec, store, 'data', '/score', noopModifiers, makeCtx(store))

        const error = store.getForStore('data.error', '/score')
        expect(error).toBe('Should be at least 10')
      })

      it('clears error when JSONata expression returns null', async () => {
        const store = new Store()
        store.setForStore('data', '/score', 5)
        const spec: InlineValidationSpec = {
          jsonataDef: '$ < 10 ? "too low" : null',
          errorMessage: 'Should be at least 10',
        }

        await runInlineValidation(spec, store, 'data', '/score', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/score')).toBe('Should be at least 10')

        store.setForStore('data', '/score', 15)
        await runInlineValidation(spec, store, 'data', '/score', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/score')).toBeNull()
      })

      it('clears error when JSONata expression returns true (pass = true means no error)', async () => {
        const store = new Store()
        const spec: InlineValidationSpec = {
          jsonataDef: '$ > 10',
          errorMessage: 'Should be greater than 10',
        }

        // First run with failing value to set an error
        store.setForStore('data', '/value', 5)
        await runInlineValidation(spec, store, 'data', '/value', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/value')).toBe('Should be greater than 10')

        // Now run with passing value (expr returns true) — error should be cleared
        store.setForStore('data', '/value', 15)
        await runInlineValidation(spec, store, 'data', '/value', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/value')).toBeNull()
      })

      it('sets error when JSONata expression returns false (not null/undefined/""/true)', async () => {
        const store = new Store()
        store.setForStore('data', '/value', 5)
        const spec: InlineValidationSpec = {
          jsonataDef: '$ > 10',
          errorMessage: 'Should be greater than 10',
        }

        await runInlineValidation(spec, store, 'data', '/value', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/value')).toBe('Should be greater than 10')
      })

      it('resolves $modifier errorMessage via resolveModifier', async () => {
        const store = new Store()
        store.setForStore('data', '/value', 5)

        const mockModifiers: ModifierMap = {
          t: (params) => `[translated:${params.key}]`,
        }

        const spec: InlineValidationSpec = {
          jsonataDef: '$ > 10',
          errorMessage: { $modifier: 't', key: 'TOO_LOW' },
        }

        const ctx: ModifierContext = { store, currentPath: '/' }
        await runInlineValidation(spec, store, 'data', '/value', mockModifiers, ctx)
        expect(store.getForStore('data.error', '/value')).toBe('[translated:TOO_LOW]')
      })

      it('skips validation when neither schema nor jsonataDef is present', async () => {
        const store = new Store()
        store.setForStore('data', '/value', 5)
        const spec: InlineValidationSpec = {}

        await runInlineValidation(spec, store, 'data', '/value', noopModifiers, makeCtx(store))
        expect(store.getForStore('data.error', '/value')).toBeUndefined()
      })
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
