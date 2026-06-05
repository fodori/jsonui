import { describe, it, expect } from 'vitest'
import { buildValidationRegistry, runInlineValidation, runValidationsForPath } from './validation.js'
import { FormStore } from '../store/formStore.js'
import { InlineValidationSpec, ModifierContext, ModifierMap, ValidationRule } from '../util/types.js'

const noopModifiers: ModifierMap = {}
const makeCtx = (formStore: FormStore): ModifierContext => ({
  formStore,
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
        const formStore = new FormStore()
        formStore.set('data', '/user/age', 15)
        const spec: InlineValidationSpec = {
          schema: { type: 'number', minimum: 18 },
        }

        await runInlineValidation(spec, 'data', '/user/age', noopModifiers, makeCtx(formStore))

        const error = formStore.get('data.error', '/user/age')
        expect(typeof error).toBe('string')
        expect(String(error).length).toBeGreaterThan(0)
      })

      it('clears existing error when value becomes valid', async () => {
        const formStore = new FormStore()
        formStore.set('data', '/user/age', 15)
        const spec: InlineValidationSpec = {
          schema: { type: 'number', minimum: 18 },
        }
        await runInlineValidation(spec, 'data', '/user/age', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/user/age')).toBeDefined()

        formStore.set('data', '/user/age', 20)
        await runInlineValidation(spec, 'data', '/user/age', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/user/age')).toBeNull()
      })
    })

    describe('jsonataDef-based', () => {
      it('sets plain string errorMessage when JSONata expression returns truthy non-boolean', async () => {
        const formStore = new FormStore()
        formStore.set('data', '/score', 5)
        const spec: InlineValidationSpec = {
          jsonataDef: '$ < 10 ? "too low" : null',
          errorMessage: 'Should be at least 10',
        }

        await runInlineValidation(spec, 'data', '/score', noopModifiers, makeCtx(formStore))

        const error = formStore.get('data.error', '/score')
        expect(error).toBe('Should be at least 10')
      })

      it('clears error when JSONata expression returns null', async () => {
        const formStore = new FormStore()
        formStore.set('data', '/score', 5)
        const spec: InlineValidationSpec = {
          jsonataDef: '$ < 10 ? "too low" : null',
          errorMessage: 'Should be at least 10',
        }

        await runInlineValidation(spec, 'data', '/score', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/score')).toBe('Should be at least 10')

        formStore.set('data', '/score', 15)
        await runInlineValidation(spec, 'data', '/score', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/score')).toBeNull()
      })

      it('clears error when JSONata expression returns true (pass = true means no error)', async () => {
        const formStore = new FormStore()
        const spec: InlineValidationSpec = {
          jsonataDef: '$ > 10',
          errorMessage: 'Should be greater than 10',
        }

        // First run with failing value to set an error
        formStore.set('data', '/value', 5)
        await runInlineValidation(spec, 'data', '/value', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/value')).toBe('Should be greater than 10')

        // Now run with passing value (expr returns true) — error should be cleared
        formStore.set('data', '/value', 15)
        await runInlineValidation(spec, 'data', '/value', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/value')).toBeNull()
      })

      it('sets error when JSONata expression returns false (not null/undefined/""/true)', async () => {
        const formStore = new FormStore()
        formStore.set('data', '/value', 5)
        const spec: InlineValidationSpec = {
          jsonataDef: '$ > 10',
          errorMessage: 'Should be greater than 10',
        }

        await runInlineValidation(spec, 'data', '/value', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/value')).toBe('Should be greater than 10')
      })

      it('resolves $modifier errorMessage via resolveModifier', async () => {
        const formStore = new FormStore()
        formStore.set('data', '/value', 5)

        const mockModifiers: ModifierMap = {
          t: (params) => `[translated:${params.key}]`,
        }

        const spec: InlineValidationSpec = {
          jsonataDef: '$ > 10',
          errorMessage: { $modifier: 't', key: 'TOO_LOW' },
        }

        const ctx: ModifierContext = { formStore, currentPath: '/' }
        await runInlineValidation(spec, 'data', '/value', mockModifiers, ctx)
        expect(formStore.get('data.error', '/value')).toBe('[translated:TOO_LOW]')
      })

      it('uses the JSONata result as error when errorMessage is omitted', async () => {
        const formStore = new FormStore()
        formStore.set('data', '/score', 5)

        const spec: InlineValidationSpec = {
          jsonataDef: '$ < 10 ? "too low" : null',
        }

        await runInlineValidation(spec, 'data', '/score', noopModifiers, makeCtx(formStore))
        expect(formStore.get('data.error', '/score')).toBe('too low')
      })

      it('uses the caught JSONata error when errorMessage is omitted', async () => {
        const formStore = new FormStore()
        formStore.set('data', '/score', 'abc')

        const spec: InlineValidationSpec = {
          jsonataDef: '$ > 20',
        }

        await runInlineValidation(spec, 'data', '/score', noopModifiers, makeCtx(formStore))

        const error = formStore.get('data.error', '/score')
        expect(typeof error).toBe('string')
        expect(String(error).length).toBeGreaterThan(0)
      })

      it('skips validation when neither schema nor jsonataDef is present', async () => {
        const store = new FormStore()
        store.set('data', '/value', 5)
        const spec: InlineValidationSpec = {}

        await runInlineValidation(spec, 'data', '/value', noopModifiers, makeCtx(store))
        expect(store.get('data.error', '/value')).toBeUndefined()
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
      const formStore = new FormStore()
      formStore.set('data', '/user/name', '')

      runValidationsForPath(registry, formStore, 'data', '/user/name')

      const error = formStore.get('data.error', '/user/name')
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
      const formStore = new FormStore()
      formStore.set('data', '/players', [{ score: -1 }])

      runValidationsForPath(registry, formStore, 'data', '/players/0/score')
      expect(formStore.get('data.error', '/players/0/score')).toBeDefined()

      // Fix the score and rerun
      formStore.set('data', '/players/0/score', 10)
      runValidationsForPath(registry, formStore, 'data', '/players/0/score')
      expect(formStore.get('data.error', '/players/0/score')).toBeNull()
    })

    it('stores root-level AJV errors at key "/" (path /~1) instead of overwriting the error store', () => {
      // AJV `required` errors have instancePath="" — they must NOT be stored as a plain
      // string at "/" which would destroy all nested field errors.
      const rules: ValidationRule[] = [
        {
          store: 'data',
          path: '/',
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              email: { type: 'string' },
            },
          },
        },
      ]

      const registry = buildValidationRegistry(rules)
      const formStore = new FormStore()
      // email present but name absent (required)
      formStore.set('data', '/email', 'test@example.com')

      runValidationsForPath(registry, formStore, 'data', '/email')

      // The error store root must be an object, not a plain string
      const storeRoot = formStore.get('data.error', '/')
      expect(typeof storeRoot).not.toBe('string')

      // Root-level error must be accessible at "/~1" (JSON Pointer for key "/")
      const rootKeyError = formStore.get('data.error', '/~1')
      expect(typeof rootKeyError).toBe('string')
      expect(String(rootKeyError).length).toBeGreaterThan(0)
    })

    it('does not corrupt the error store on consecutive runs (no A/B flickering)', () => {
      // Regression: previously writing a plain string at "/" caused the error store to become
      // a string. Subsequent collectExistingPaths found no sub-paths, so writes alternated
      // between {email: "..."} and "joined required errors" on consecutive keystrokes.
      const rules: ValidationRule[] = [
        {
          store: 'data',
          path: '/',
          schema: {
            type: 'object',
            required: ['name'],
            properties: {
              email: { type: 'string', minLength: 5 },
            },
          },
        },
      ]

      const registry = buildValidationRegistry(rules)
      const formStore = new FormStore()
      // name absent, email too short
      formStore.set('data', '/email', 'hi')

      runValidationsForPath(registry, formStore, 'data', '/email')
      const afterRun1 = formStore.get('data.error', '/')

      formStore.set('data', '/email', 'hey')
      runValidationsForPath(registry, formStore, 'data', '/email')
      const afterRun2 = formStore.get('data.error', '/')

      // Both runs must produce an object, never a plain string
      expect(typeof afterRun1).not.toBe('string')
      expect(typeof afterRun2).not.toBe('string')

      // Field-level error must still be accessible after both runs
      const emailError = formStore.get('data.error', '/email')
      expect(typeof emailError).toBe('string')
    })
  })
})
