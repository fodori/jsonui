import { describe, it, expect } from 'vitest'
import { FormStore } from '../store/formStore.js'
import { resolveAction } from './resolveAction.js'
import { JsonUINode } from '../util/types.js'

describe('resolveAction', () => {
  it('handles missing componentProps without throwing', async () => {
    const formStore = new FormStore()

    const handler = resolveAction(
      {
        $action: 'set',
        store: 'data',
        path: '/name',
      },
      {},
      {},
      {
        formStore,
        currentPath: '/',
        componentProps: undefined as unknown as JsonUINode,
      }
    )

    expect(typeof handler).toBe('function')
    await expect(handler?.({ target: { value: 'Bob' } })).resolves.toBeUndefined()
    expect(formStore.get('data', '/name')).toBe('Bob')
  })

  it('returns undefined for non-action payloads', () => {
    const formStore = new FormStore()

    const handler = resolveAction(
      {
        store: 'data',
        path: '/name',
      },
      {},
      {},
      {
        formStore,
        currentPath: '/',
        componentProps: {},
      }
    )

    expect(handler).toBeUndefined()
  })
})
