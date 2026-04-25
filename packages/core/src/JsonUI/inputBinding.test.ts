import { describe, it, expect, vi } from 'vitest'
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
  it('resolveModifier get reads /age from data store with empty ModifierMap', async () => {
    const stores = makeStoresWithData(42)
    const ctx: ModifierContext = {
      stores,
      currentPath: '/',
    }
    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: '/age' }, {}, ctx)
    expect(value).toBe(42)
  })

  it('resolveAction set writes event target value to data/age with empty ActionMap', async () => {
    const stores = makeStoresWithData('')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
    const root = stores.__root__!
    const ctx = {
      currentPath: '/' as const,
      pathModifiers: undefined,
    }
    const handler = resolveAction({ $action: 'set', store: 'data', path: '/age' }, {}, {}, stores, {
      stores,
      ...ctx,
      componentProps: {},
    })
    expect(handler).toBeDefined()

    await handler!({ target: { value: 'test@example.com' } })

    expect(root.getForStore('data', '/age')).toBe('test@example.com')
  })

  it('resolveModifier get with type ERROR returns undefined for leaf-less error containers', async () => {
    const stores = makeStoresWithData(42)
     
    const root = stores.__root__
    root.setForStore('data.error', '/', { players: [{}] }, false)

    const ctx: ModifierContext = {
      stores,
      currentPath: '/',
    }

    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: '/', type: 'ERROR' }, {}, ctx)
    expect(value).toBeUndefined()
  })

  it('resolveModifier get with type ERROR returns value when a real error leaf exists', async () => {
    const stores = makeStoresWithData(42)
     
    const root = stores.__root__
    root.setForStore('data.error', '/', { players: [{ name: 'required' }] }, false)

    const ctx: ModifierContext = {
      stores,
      currentPath: '/',
    }

    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: '/', type: 'ERROR' }, {}, ctx)
    expect(value).toEqual({ players: [{ name: 'required' }] })
  })

  it('resolveAction passes component props as fallback params to action handlers', async () => {
    const stores = makeStoresWithData(42)
    const submitSpy = vi.fn()

    const handler = resolveAction({ $action: 'submit', store: 'data', path: '/' }, { submit: submitSpy }, {}, stores, {
      stores,
      currentPath: '/',
      componentProps: { value: { score: '10' }, fieldTouched: true },
    })

    expect(handler).toBeDefined()
    await handler!({})

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy.mock.calls[0][0]).toEqual({
      value: { score: '10' },
      fieldTouched: true,
      store: 'data',
      path: '/',
    })
  })

  it('resolveAction explicit params override component props', async () => {
    const stores = makeStoresWithData(42)
    const submitSpy = vi.fn()

    const handler = resolveAction({ $action: 'submit', value: { score: '20' } }, { submit: submitSpy }, {}, stores, {
      stores,
      currentPath: '/',
      componentProps: { value: { score: '10' } },
    })

    expect(handler).toBeDefined()
    await handler!({})

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy.mock.calls[0][0]).toEqual({
      value: { score: '20' },
    })
  })

  it('resolveModifier get with type ERROR uses base store pathModifiers for relative paths', async () => {
    const stores = makeStoresWithData(42)
     
    const root = stores.__root__
    root.setForStore('data.error', '/players/0/name', 'required', false)

    const ctx: ModifierContext = {
      stores,
      currentPath: '/',
      pathModifiers: {
        data: { path: '/players/0' },
      },
    }

    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: 'name', type: 'ERROR' }, {}, ctx)
    expect(value).toBe('required')
  })
})
