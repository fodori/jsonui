import { ReduxPath } from 'utils/types'
import { getStateValue } from './selectors'

test('getStateValue test', () => {
  expect(getStateValue({}, { store: 'data', path: '' }, {})).toBe(null)
  expect(getStateValue({ root: { data: { age: 66 } } }, {} as ReduxPath, {})).toBe(null)
  expect(getStateValue({}, { store: 'data', path: 'age' }, {})).toBe(null)
  expect(getStateValue(null, { store: 'data', path: 'age' }, {})).toBe(null)
  expect(getStateValue(null, { store: '', path: '' }, {})).toBe(null)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: 'age' }, {})).toBe(66)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: '/age' }, {})).toBe(66)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'dat', path: '/age' }, {})).toBe(undefined)
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: '/' }, {})).toEqual({ age: 66 })
  expect(getStateValue({ root: { data: { age: 66 } } }, { store: 'data', path: '' }, {})).toEqual(null)
  expect(getStateValue({ root: { data: { age: true } } }, { store: 'data', path: '/age' }, {})).toEqual(true)
  expect(getStateValue({ root: { data: { age: false } } }, { store: 'data', path: '/age' }, {})).toEqual(false)
  expect(getStateValue({ root: { data: { age: null } } }, { store: 'data', path: '/age' }, {})).toEqual(null)
  expect(getStateValue({ root: { data: { age: '' } } }, { store: 'data', path: '/age' }, {})).toEqual('')
  expect(getStateValue({ root: { data: { age: undefined } } }, { store: 'data', path: '/age' }, {})).toEqual(undefined)
})
