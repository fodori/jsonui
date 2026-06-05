import { describe, it, expect } from 'vitest'
import { FormStore } from '../store/formStore.js'
import { createGetModifier } from './getModifier.js'

describe('createGetModifier', () => {
  it('returns undefined when store name is missing', async () => {
    const formStore = new FormStore()
    const get = createGetModifier(formStore)

    await expect(get({ path: '/name' }, { formStore, currentPath: '/' })).resolves.toBeUndefined()
  })

  it('reads values for valid store/path', async () => {
    const formStore = new FormStore()
    formStore.set('data', '/name', 'Alice')
    const get = createGetModifier(formStore)

    await expect(get({ store: 'data', path: '/name' }, { formStore, currentPath: '/' })).resolves.toBe('Alice')
  })

  it('type TOUCH with getBoolean=true (default) returns a boolean', async () => {
    const formStore = new FormStore()
    formStore.set('data', '/name', 'Alice')
    const get = createGetModifier(formStore)

    const result = await get({ store: 'data', path: '/', type: 'TOUCH' }, { formStore, currentPath: '/' })
    expect(typeof result).toBe('boolean')
    expect(result).toBe(true)
  })

  it('type TOUCH with getBoolean=false returns the whole touch tree', async () => {
    const formStore = new FormStore()
    formStore.set('data', '/name', 'Alice')
    formStore.set('data', '/email', 'a@b.com')
    const get = createGetModifier(formStore)

    const result = await get({ store: 'data', path: '/', type: 'TOUCH', getBoolean: false }, { formStore, currentPath: '/' })
    expect(result).toEqual(expect.objectContaining({ name: true, email: true }))
  })

  it('type TOUCH with getBoolean=true returns false when nothing is touched', async () => {
    const formStore = new FormStore()
    formStore.initializeStore('data', { name: 'Alice' })
    const get = createGetModifier(formStore)

    const result = await get({ store: 'data', path: '/', type: 'TOUCH' }, { formStore, currentPath: '/' })
    expect(result).toBe(false)
  })

  it('type TOUCH with getBoolean=false returns undefined tree when nothing is touched', async () => {
    const formStore = new FormStore()
    formStore.initializeStore('data', { name: 'Alice' })
    const get = createGetModifier(formStore)

    const result = await get({ store: 'data', path: '/', type: 'TOUCH', getBoolean: false }, { formStore, currentPath: '/' })
    expect(result).toBeUndefined()
  })
})
