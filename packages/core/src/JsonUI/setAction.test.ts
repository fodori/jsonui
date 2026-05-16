import { describe, it, expect } from 'vitest'
import { createSetAction } from './setAction.js'
import { FormStore } from '../store/formStore.js'

describe('createSetAction', () => {
  it('sets value in the specified logical store and path', async () => {
    const formStore = new FormStore()
    const setAction = createSetAction(formStore)

    await setAction({
      store: 'data',
      path: '/user/name',
      value: 'Alice',
    })

    expect(formStore.get('data', '/user/name')).toBe('Alice')
    // touched store should also be updated
    expect(formStore.get('data.touch', '/user/name')).toBe(true)
  })

  it('sets value in the specified logical store and path', async () => {
    const formStore = new FormStore()
    const setAction = createSetAction(formStore)

    await setAction({
      store: 'data',
      path: 'name',
      value: 'Alice',
    })

    expect(formStore.get('data', 'name')).toBe('Alice')
    // touched store should also be updated
    expect(formStore.get('data.touch', 'name')).toBe(true)
  })

  it('sets value in the specified logical store and path', async () => {
    const formStore = new FormStore()
    const setAction = createSetAction(formStore)

    await setAction({
      store: 'data',
      path: '../name',
      value: 'Alice',
    })

    expect(formStore.get('data', 'name')).toBe('Alice')
    // touched store should also be updated
    expect(formStore.get('data.touch', 'name')).toBe(true)
  })

  it('resolves relative paths using currentPath and pathModifiers', async () => {
    const formStore = new FormStore()
    const setAction = createSetAction(formStore)

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

    expect(formStore.get('data', '/players/0/score')).toBe(10)
  })

  it('resolves relative paths using currentPath and pathModifiers', async () => {
    const formStore = new FormStore()
    const setAction = createSetAction(formStore)

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

    expect(formStore.get('data', '/players/0/score')).toBe(undefined)
    expect(formStore.get('data', '/score')).toBe(10)
  })

  it('resolves relative paths using currentPath and pathModifiers', async () => {
    const formStore = new FormStore()
    const setAction = createSetAction(formStore)

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

    expect(formStore.get('data', '/players/0/score')).toBe(undefined)
    expect(formStore.get('data', '/players/score')).toBe(10)
  })

  it('applies jsonataDef to value before set (root $ is incoming value)', async () => {
    const formStore = new FormStore()
    const setAction = createSetAction(formStore)

    await setAction({
      store: 'data',
      path: '/profile/0/exampledata',
      value: 'John Doe',
      jsonataDef: "'Prefix: ' & $",
    })

    expect(formStore.get('data', '/profile/0/exampledata')).toBe('Prefix: John Doe')
  })
})
