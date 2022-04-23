import { getStateValue, ReduxPathType } from './selectors'

test('getStateValue test', () => {
  expect(getStateValue({}, { store: 'data', path: '' }, {})).toBe(null)
  expect(getStateValue({ root: { data: { age: 66 } } }, {} as ReduxPathType, {})).toBe(null)
  expect(getStateValue({}, { store: 'data', path: 'age' }, {})).toBe(null)
  expect(getStateValue(null, { store: 'data', path: 'age' }, {})).toBe(null)
  expect(getStateValue(null, { store: '', path: '' }, {})).toBe(null)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: 'age' }, {})).toBe(66)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: '/age' }, {})).toBe(66)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'dat', path: '/age' }, {})).toBe(null)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: '/' }, {})).toEqual({ age: 66 })
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: '' }, {})).toEqual(null)
})
