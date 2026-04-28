import { describe, it, expect, vi } from 'vitest'
import { Store } from '../store/store.js'
import { resolveModifier } from './resolveModifier.js'
import { resolveAction } from './resolveAction.js'
import type { ModifierContext } from '../util/types.js'

function makeStoresWithData(age: string | number = ''): Store {
  const root = new Store()
  root.setForStore('data', '/', { age }, false)
  return root
}

describe('input-style store binding (get / set)', () => {
  it('resolveModifier get reads /age from data store with empty ModifierMap', async () => {
    const store = makeStoresWithData(42)
    const ctx: ModifierContext = {
      store,
      currentPath: '/',
    }
    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: '/age' }, {}, ctx)
    expect(value).toBe(42)
  })

  it('resolveAction set writes event target value to data/age with empty ActionMap', async () => {
    const store = makeStoresWithData('')
    const ctx = {
      currentPath: '/' as const,
      pathModifiers: undefined,
    }
    const handler = resolveAction({ $action: 'set', store: 'data', path: '/age' }, {}, {}, store, {
      store,
      ...ctx,
      componentProps: {},
    })
    expect(handler).toBeDefined()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await handler!({ target: { value: 'test@example.com' } })

    expect(store.getForStore('data', '/age')).toBe('test@example.com')
  })

  it('resolveModifier get with type ERROR returns undefined for leaf-less error containers', async () => {
    const store = makeStoresWithData(42)

    store.setForStore('data.error', '/', { players: [{}] }, false)

    const ctx: ModifierContext = {
      store,
      currentPath: '/',
    }

    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: '/', type: 'ERROR' }, {}, ctx)
    expect(value).toBeUndefined()
  })

  it('resolveModifier get with type ERROR returns value when a real error leaf exists', async () => {
    const store = makeStoresWithData(42)

    store.setForStore('data.error', '/', { players: [{ name: 'required' }] }, false)

    const ctx: ModifierContext = {
      store,
      currentPath: '/',
    }

    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: '/', type: 'ERROR' }, {}, ctx)
    expect(value).toEqual({ players: [{ name: 'required' }] })
  })

  it('resolveAction passes component props as fallback params to action handlers', async () => {
    const store = makeStoresWithData(42)
    const submitSpy = vi.fn()

    const handler = resolveAction({ $action: 'submit', store: 'data', path: '/' }, { submit: submitSpy }, {}, store, {
      store,
      currentPath: '/',
      componentProps: { value: { score: '10' }, fieldTouched: true },
    })

    expect(handler).toBeDefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    const store = makeStoresWithData(42)
    const submitSpy = vi.fn()

    const handler = resolveAction({ $action: 'submit', value: { score: '20' } }, { submit: submitSpy }, {}, store, {
      store,
      currentPath: '/',
      componentProps: { value: { score: '10' } },
    })

    expect(handler).toBeDefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await handler!({})

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy.mock.calls[0][0]).toEqual({
      value: { score: '20' },
    })
  })

  it('resolveModifier get with type ERROR uses base store pathModifiers for relative paths', async () => {
    const store = makeStoresWithData(42)

    store.setForStore('data.error', '/players/0/name', 'required', false)

    const ctx: ModifierContext = {
      store,
      currentPath: '/',
      pathModifiers: {
        data: { path: '/players/0' },
      },
    }

    const value = await resolveModifier({ $modifier: 'get', store: 'data', path: 'name', type: 'ERROR' }, {}, ctx)
    expect(value).toBe('required')
  })
})
