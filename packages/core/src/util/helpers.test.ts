import { describe, it, expect } from 'vitest'
import { assertJsonCompatible, cloneDeep, hasAnyError, hasAnyTouched } from './helpers.js'

describe('hasAnyError', () => {
  it('returns false for null', () => {
    expect(hasAnyError(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(hasAnyError(undefined)).toBe(false)
  })

  it('returns true for a non-null primitive', () => {
    expect(hasAnyError('Required')).toBe(true)
    expect(hasAnyError(0)).toBe(true)
    expect(hasAnyError(false)).toBe(true)
  })

  it('returns false for an empty object', () => {
    expect(hasAnyError({})).toBe(false)
  })

  it('returns false for an empty array', () => {
    expect(hasAnyError([])).toBe(false)
  })

  it('returns true when any object value has an error', () => {
    expect(hasAnyError({ field: 'Too short', other: null })).toBe(true)
  })

  it('returns false when all object values are null/undefined', () => {
    expect(hasAnyError({ a: null, b: undefined })).toBe(false)
  })

  it('returns true when any array element has an error', () => {
    expect(hasAnyError([null, 'error', null])).toBe(true)
  })

  it('returns false when all array elements are null/undefined', () => {
    expect(hasAnyError([null, undefined])).toBe(false)
  })

  it('recurses into nested objects', () => {
    expect(hasAnyError({ a: { b: { c: 'deep error' } } })).toBe(true)
    expect(hasAnyError({ a: { b: { c: null } } })).toBe(false)
  })

  it('recurses into nested arrays', () => {
    expect(hasAnyError([[null], ['error']])).toBe(true)
    expect(hasAnyError([[null], [null]])).toBe(false)
  })
})

describe('hasAnyTouched', () => {
  it('returns false for null', () => {
    expect(hasAnyTouched(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(hasAnyTouched(undefined)).toBe(false)
  })

  it('returns true for literal true', () => {
    expect(hasAnyTouched(true)).toBe(true)
  })

  it('returns false for false', () => {
    expect(hasAnyTouched(false)).toBe(false)
  })

  it('returns false for other primitives', () => {
    expect(hasAnyTouched(0)).toBe(false)
    expect(hasAnyTouched('touched')).toBe(false)
  })

  it('returns false for an empty object', () => {
    expect(hasAnyTouched({})).toBe(false)
  })

  it('returns false for an empty array', () => {
    expect(hasAnyTouched([])).toBe(false)
  })

  it('returns true when any object value is true', () => {
    expect(hasAnyTouched({ field: true, other: false })).toBe(true)
  })

  it('returns false when no object value is true', () => {
    expect(hasAnyTouched({ a: false, b: null })).toBe(false)
  })

  it('returns true when any array element is true', () => {
    expect(hasAnyTouched([false, true, false])).toBe(true)
  })

  it('returns false when no array element is true', () => {
    expect(hasAnyTouched([false, null, undefined])).toBe(false)
  })

  it('recurses into nested objects', () => {
    expect(hasAnyTouched({ a: { b: { c: true } } })).toBe(true)
    expect(hasAnyTouched({ a: { b: { c: false } } })).toBe(false)
  })

  it('recurses into nested arrays', () => {
    expect(hasAnyTouched([[false], [true]])).toBe(true)
    expect(hasAnyTouched([[false], [false]])).toBe(false)
  })
})

describe('assertJsonCompatible', () => {
  it('accepts null', () => {
    expect(() => assertJsonCompatible(null)).not.toThrow()
  })

  it('accepts JSON primitives', () => {
    expect(() => assertJsonCompatible('hello')).not.toThrow()
    expect(() => assertJsonCompatible(42)).not.toThrow()
    expect(() => assertJsonCompatible(0)).not.toThrow()
    expect(() => assertJsonCompatible(true)).not.toThrow()
    expect(() => assertJsonCompatible(false)).not.toThrow()
  })

  it('accepts plain objects and arrays', () => {
    expect(() => assertJsonCompatible({ a: 1, b: [2, 3] })).not.toThrow()
    expect(() => assertJsonCompatible([1, 'two', null, { x: true }])).not.toThrow()
    expect(() => assertJsonCompatible({})).not.toThrow()
    expect(() => assertJsonCompatible([])).not.toThrow()
  })

  it('rejects undefined', () => {
    expect(() => assertJsonCompatible(undefined)).toThrow('undefined is not JSON-compatible')
  })

  it('rejects functions', () => {
    expect(() => assertJsonCompatible(() => {})).toThrow('function is not JSON-compatible')
  })

  it('rejects symbols', () => {
    expect(() => assertJsonCompatible(Symbol('s'))).toThrow('symbol is not JSON-compatible')
  })

  it('rejects bigint', () => {
    expect(() => assertJsonCompatible(BigInt(1))).toThrow('bigint is not JSON-compatible')
  })

  it('rejects NaN', () => {
    expect(() => assertJsonCompatible(NaN)).toThrow('Non-finite number')
  })

  it('rejects Infinity', () => {
    expect(() => assertJsonCompatible(Infinity)).toThrow('Non-finite number')
    expect(() => assertJsonCompatible(-Infinity)).toThrow('Non-finite number')
  })

  it('rejects a function nested inside an object', () => {
    expect(() => assertJsonCompatible({ ok: 1, bad: () => {} })).toThrow('function is not JSON-compatible')
  })

  it('rejects a function nested inside an array', () => {
    expect(() => assertJsonCompatible([1, () => {}])).toThrow('function is not JSON-compatible')
  })

  it('rejects circular references', () => {
    const a: Record<string, unknown> = {}
    a.self = a
    expect(() => assertJsonCompatible(a)).toThrow('Circular reference')
  })

  it('allows the same object reference appearing in two separate branches (diamond)', () => {
    const shared = { x: 1 }
    expect(() => assertJsonCompatible({ a: shared, b: shared })).not.toThrow()
  })
})

describe('cloneDeep', () => {
  it('returns null as-is', () => {
    expect(cloneDeep(null)).toBeNull()
  })

  it('returns undefined as-is', () => {
    expect(cloneDeep(undefined)).toBeUndefined()
  })

  it('returns primitives as-is', () => {
    expect(cloneDeep(42)).toBe(42)
    expect(cloneDeep('hello')).toBe('hello')
    expect(cloneDeep(true)).toBe(true)
  })

  it('clones a flat object', () => {
    const original = { a: 1, b: 'x' }
    const clone = cloneDeep(original)
    expect(clone).toEqual(original)
    expect(clone).not.toBe(original)
  })

  it('clones a nested object deeply', () => {
    const original = { a: { b: { c: 3 } } }
    const clone = cloneDeep(original)
    expect(clone).toEqual(original)
    clone.a.b.c = 99
    expect(original.a.b.c).toBe(3)
  })

  it('clones a flat array', () => {
    const original = [1, 2, 3]
    const clone = cloneDeep(original)
    expect(clone).toEqual(original)
    expect(clone).not.toBe(original)
  })

  it('clones a nested array deeply', () => {
    const original = [
      [1, 2],
      [3, 4],
    ]
    const clone = cloneDeep(original)
    expect(clone).toEqual(original)
    clone[0][0] = 99
    expect(original[0][0]).toBe(1)
  })

  it('clones an array of objects deeply', () => {
    const original = [{ x: 1 }, { x: 2 }]
    const clone = cloneDeep(original)
    clone[0].x = 99
    expect(original[0].x).toBe(1)
  })

  it('clones an object with array values deeply', () => {
    const original = { items: [1, 2, 3] }
    const clone = cloneDeep(original)
    clone.items.push(4)
    expect(original.items).toHaveLength(3)
  })

  it('mutating the clone does not affect the original', () => {
    const original = { nested: { value: 42 } }
    const clone = cloneDeep(original)
    clone.nested.value = 0
    expect(original.nested.value).toBe(42)
  })

  it('throws for a function value', () => {
    expect(() => cloneDeep(() => {})).toThrow('function is not JSON-compatible')
  })

  it('throws for a symbol value', () => {
    expect(() => cloneDeep(Symbol('s'))).toThrow('symbol is not JSON-compatible')
  })

  it('throws for NaN', () => {
    expect(() => cloneDeep(NaN)).toThrow('Non-finite number')
  })

  it('throws for a function nested in an object', () => {
    expect(() => cloneDeep({ fn: () => {} })).toThrow('function is not JSON-compatible')
  })
})
