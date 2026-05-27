import { describe, it, expect } from 'vitest'
import { FormStore } from '@jsonui/core'
import { resolveExplicitFieldErrors, buildComponentContext } from './buildInfraAndInputProps.js'

const ERROR_STORE = 'data.error'

const makeFormStore = (errorValue?: unknown) => {
  const formStore = new FormStore()
  if (errorValue !== undefined) {
    formStore.set(ERROR_STORE, '/', errorValue, false)
  }
  return formStore
}

const makeActions = () => ({}) as ReturnType<typeof buildComponentContext>['actions']
const makeModifiers = () => ({}) as ReturnType<typeof buildComponentContext>['modifiers']

describe('resolveExplicitFieldErrors', () => {
  it('returns undefined when node.value is not a $modifier spec', () => {
    const formStore = makeFormStore()
    expect(resolveExplicitFieldErrors({ node: { value: 'plain' }, formStore })).toBeUndefined()
    expect(resolveExplicitFieldErrors({ node: {}, formStore })).toBeUndefined()
    expect(resolveExplicitFieldErrors({ node: { value: { $modifier: 'set', store: 'data', path: '/name' } }, formStore })).toBeUndefined()
  })

  it('returns undefined when store or path is missing from the spec', () => {
    const formStore = makeFormStore()
    expect(resolveExplicitFieldErrors({ node: { value: { $modifier: 'get', path: '/name' } }, formStore })).toBeUndefined()
    expect(resolveExplicitFieldErrors({ node: { value: { $modifier: 'get', store: 'data' } }, formStore })).toBeUndefined()
  })

  it('returns undefined when the error store is empty', () => {
    const formStore = makeFormStore()
    const node = { value: { $modifier: 'get', store: 'data', path: '/name' } }
    expect(resolveExplicitFieldErrors({ node, formStore })).toBeUndefined()
  })

  it('returns undefined for a leaf-less container (null values only)', () => {
    // This was the bug: { simplifiedField: null } should not count as a real error
    const formStore = makeFormStore({ simplifiedField: null })
    const node = { value: { $modifier: 'get', store: 'data', path: '/' } }
    expect(resolveExplicitFieldErrors({ node, formStore })).toBeUndefined()
  })

  it('returns undefined for nested leaf-less containers', () => {
    const formStore = makeFormStore({ players: [null, null] })
    const node = { value: { $modifier: 'get', store: 'data', path: '/' } }
    expect(resolveExplicitFieldErrors({ node, formStore })).toBeUndefined()
  })

  it('returns the error value when a real leaf error string exists', () => {
    const formStore = makeFormStore({ simplifiedField: 'Required' })
    const node = { value: { $modifier: 'get', store: 'data', path: '/' } }
    expect(resolveExplicitFieldErrors({ node, formStore })).toEqual({ simplifiedField: 'Required' })
  })

  it('returns the error value when a deeply nested leaf error exists', () => {
    const formStore = makeFormStore({ players: [{ name: 'Too short' }] })
    const node = { value: { $modifier: 'get', store: 'data', path: '/' } }
    expect(resolveExplicitFieldErrors({ node, formStore })).toEqual({ players: [{ name: 'Too short' }] })
  })

  it('returns the error for a direct string leaf error', () => {
    const formStore = new FormStore()
    formStore.set(ERROR_STORE, '/name', 'Required', false)
    const node = { value: { $modifier: 'get', store: 'data', path: '/name' } }
    expect(resolveExplicitFieldErrors({ node, formStore })).toBe('Required')
  })
})

describe('buildComponentContext — fieldErrors and fieldTouched', () => {
  const base = {
    formStore: makeFormStore(),
    modifiers: makeModifiers(),
    actions: makeActions(),
    currentPath: '/',
  }

  it('omits fieldErrors and fieldTouched when both are undefined', () => {
    const ctx = buildComponentContext(base)
    expect(ctx.fieldErrors).toBeUndefined()
    expect(ctx.fieldTouched).toBeUndefined()
    expect('fieldErrors' in ctx).toBe(false)
    expect('fieldTouched' in ctx).toBe(false)
  })

  it('sets fieldErrors when provided', () => {
    const ctx = buildComponentContext({ ...base, fieldErrors: 'Required' })
    expect(ctx.fieldErrors).toBe('Required')
    expect('fieldTouched' in ctx).toBe(false)
  })

  it('sets fieldTouched when provided', () => {
    const ctx = buildComponentContext({ ...base, fieldTouched: true })
    expect(ctx.fieldTouched).toBe(true)
    expect('fieldErrors' in ctx).toBe(false)
  })

  it('sets both fieldErrors and fieldTouched when both are provided', () => {
    const ctx = buildComponentContext({ ...base, fieldErrors: 'Bad value', fieldTouched: true })
    expect(ctx.fieldErrors).toBe('Bad value')
    expect(ctx.fieldTouched).toBe(true)
  })

  it('sets fieldErrors even when the value is null (explicit null is still defined)', () => {
    const ctx = buildComponentContext({ ...base, fieldErrors: null })
    expect('fieldErrors' in ctx).toBe(true)
    expect(ctx.fieldErrors).toBeNull()
  })
})
