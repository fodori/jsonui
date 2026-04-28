import { describe, it, expect } from 'vitest'
import { cloneDeep } from './helpers.js'

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
})
