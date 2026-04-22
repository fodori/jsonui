import { describe, it, expect } from 'vitest'
import { Store } from '../store.js'
import { resolveModifier } from './resolveModifier.js'
import { resolveAction } from './resolveAction.js'
import type { ModifierContext } from '../types.js'

function makeStoresWithData(age: string | number = ''): Record<string, Store> {
  const root = new Store()
  root.setForStore('data', '/', { age }, false)
  return { __root__: root }
}

describe('input-style store binding (get / set)', () => {
  it('resolveModifier get reads /age from data store with empty FunctionMap', async () => {
    const stores = makeStoresWithData(42)
    const ctx: ModifierContext = {
      stores,
      currentPath: '/',
    }
    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: '/age' }, {}, ctx)
    expect(value).toBe(42)
  })

  it('resolveAction set writes event target value to data/age with empty FunctionMap', async () => {
    const stores = makeStoresWithData('')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
    const root = stores.__root__!
    const ctx = {
      currentPath: '/' as const,
      pathModifiers: undefined,
    }
    const handler = resolveAction({ $action: 'set', store: 'data', path: '/age' }, {}, stores, ctx)
    expect(handler).toBeDefined()

    await handler!({ target: { value: 'test@example.com' } })

    expect(root.getForStore('data', '/age')).toBe('test@example.com')
  })
})
