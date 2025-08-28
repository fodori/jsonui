import { AnyAction } from 'redux'
import { DATA_UPDATE } from './actions'
import reducer from './reducer'
import * as c from '../../utils/constants'

test('getStateValue test', () => {
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE } as AnyAction)).toEqual({ data: { age: 66 } })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: 'daa' } } as AnyAction)).toEqual({
    data: { age: 66 },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { daa: true },
  })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: 'age', value: 888 } } as AnyAction)).toEqual({
    data: { age: 888 },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: 888 } } as AnyAction)).toEqual({
    data: { age: 888 },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age/b/s/', value: 888 } } as AnyAction)).toEqual({
    data: { age: 66 },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: { b: { s: true } } },
  })

  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/c/b/s/', value: 888 } } as AnyAction)).toEqual({
    data: {
      age: 66,
      c: {
        b: {
          s: 888,
        },
      },
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { c: { b: { s: true } } },
  })

  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/c/b/s', value: 888 } } as AnyAction)).toEqual({
    data: {
      age: 66,
      c: {
        b: {
          s: 888,
        },
      },
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { c: { b: { s: true } } },
  })

  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'another', path: '/c/b/s', value: 888 } } as AnyAction)).toEqual({
    data: {
      age: 66,
    },
    another: {
      c: {
        b: {
          s: 888,
        },
      },
    },
    [`another${c.STORE_TOUCH_POSTFIX}`]: { c: { b: { s: true } } },
  })

  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: 888 } } as AnyAction)).toEqual({
    data: {
      age: 888,
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })

  expect(reducer({ data: { age: '66' } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: '888' } } as AnyAction)).toEqual({
    data: {
      age: '888',
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })

  expect(reducer({ data: { age: '66' } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: true } } as AnyAction)).toEqual({
    data: {
      age: true,
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })

  expect(reducer({ data: { age: '66' } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: null } } as AnyAction)).toEqual({
    data: {
      age: null,
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })

  expect(reducer({ data: { age: '66' } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: false } } as AnyAction)).toEqual({
    data: {
      age: false,
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })

  expect(reducer({ data: { age: '66' } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: '' } } as AnyAction)).toEqual({
    data: {
      age: '',
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })

  expect(reducer({ data: { age: '66' } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: undefined } } as AnyAction)).toEqual({
    data: {
      age: undefined,
    },
    [`data${c.STORE_TOUCH_POSTFIX}`]: { age: true },
  })
})
