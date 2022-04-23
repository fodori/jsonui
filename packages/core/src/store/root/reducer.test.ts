import { AnyAction } from 'redux'
import { DATA_UPDATE } from './actions'
import reducer from './reducer'

test('getStateValue test', () => {
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE } as AnyAction)).toEqual({ data: { age: 66 } })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: 'daa' } } as AnyAction)).toEqual({
    data: { age: 66 },
  })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: 'age', value: 888 } } as AnyAction)).toEqual({
    data: { age: 888 },
  })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age', value: 888 } } as AnyAction)).toEqual({
    data: { age: 888 },
  })
  expect(reducer({ data: { age: 66 } }, { type: DATA_UPDATE, payload: { store: 'data', path: '/age/b/s/', value: 888 } } as AnyAction)).toEqual({
    data: { age: 66 },
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
  })
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
})
