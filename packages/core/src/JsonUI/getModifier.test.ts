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
})
