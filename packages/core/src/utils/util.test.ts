import * as util from './util'

test('isNumber test with number', () => {
  expect(util.isNumber(2)).toBe(true)
})

test('isNumber test with null', () => {
  expect(util.isNumber(null)).toBe(false)
})

test('isNumber test with string', () => {
  expect(util.isNumber('0')).toBe(false)
})
