import { describe, it, expect } from 'vitest'
import { createSetAction } from './setAction.js'
import { Store } from '../store/store.js'

describe('createSetAction', () => {
  it('sets value in the specified logical store and path', async () => {
    const root = new Store()
    const stores: Record<string, Store> = { root }
    const setAction = createSetAction(stores)

    await setAction({
      store: 'data',
      path: '/user/name',
      value: 'Alice',
    })

    expect(root.getForStore('data', '/user/name')).toBe('Alice')
    // touched store should also be updated
    expect(root.getForStore('data.touch', '/user/name')).toBe(true)
  })

  it('sets value in the specified logical store and path', async () => {
    const root = new Store()
    const stores: Record<string, Store> = { root }
    const setAction = createSetAction(stores)

    await setAction({
      store: 'data',
      path: 'name',
      value: 'Alice',
    })

    expect(root.getForStore('data', 'name')).toBe('Alice')
    // touched store should also be updated
    expect(root.getForStore('data.touch', 'name')).toBe(true)
  })

  it('sets value in the specified logical store and path', async () => {
    const root = new Store()
    const stores: Record<string, Store> = { root }
    const setAction = createSetAction(stores)

    await setAction({
      store: 'data',
      path: '../name',
      value: 'Alice',
    })

    expect(root.getForStore('data', 'name')).toBe('Alice')
    // touched store should also be updated
    expect(root.getForStore('data.touch', 'name')).toBe(true)
  })

  it('resolves relative paths using currentPath and pathModifiers', async () => {
    const root = new Store()
    const stores: Record<string, Store> = { root }
    const setAction = createSetAction(stores)

    await setAction(
      {
        store: 'data',
        path: 'score',
        value: 10,
      },
      {
        currentPath: '/ignored',
        pathModifiers: {
          data: { path: '/players/0' },
        },
      }
    )

    expect(root.getForStore('data', '/players/0/score')).toBe(10)
  })

  it('resolves relative paths using currentPath and pathModifiers', async () => {
    const root = new Store()
    const stores: Record<string, Store> = { root }
    const setAction = createSetAction(stores)

    await setAction(
      {
        store: 'data',
        path: '/score',
        value: 10,
      },
      {
        currentPath: '/ignored',
        pathModifiers: {
          data: { path: '/players/0' },
        },
      }
    )

    expect(root.getForStore('data', '/players/0/score')).toBe(undefined)
    expect(root.getForStore('data', '/score')).toBe(10)
  })

  it('resolves relative paths using currentPath and pathModifiers', async () => {
    const root = new Store()
    const stores: Record<string, Store> = { root }
    const setAction = createSetAction(stores)

    await setAction(
      {
        store: 'data',
        path: '../score',
        value: 10,
      },
      {
        currentPath: '/ignored',
        pathModifiers: {
          data: { path: '/players/0' },
        },
      }
    )

    expect(root.getForStore('data', '/players/0/score')).toBe(undefined)
    expect(root.getForStore('data', '/players/score')).toBe(10)
  })

  it('applies jsonataDef to value before set (root $ is incoming value)', async () => {
    const root = new Store()
    const stores: Record<string, Store> = { root }
    const setAction = createSetAction(stores)

    await setAction({
      store: 'data',
      path: '/profile/0/exampledata',
      value: 'John Doe',
      jsonataDef: "'Prefix: ' & $",
    })

    expect(root.getForStore('data', '/profile/0/exampledata')).toBe('Prefix: John Doe')
  })
})
