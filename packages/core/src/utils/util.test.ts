import * as util from './util'
import * as c from './constants'

test('isNumber test with number', () => {
  expect(util.isNumber(2)).toBe(true)
})

test('isNumber test with null', () => {
  expect(util.isNumber(null)).toBe(false)
})

test('isNumber test with string', () => {
  expect(util.isNumber('0')).toBe(false)
})

test('jsonPointerGet test with string', () => {
  const json = 'asdasd'

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with number', () => {
  const json = 33

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with boolean', () => {
  const json = true

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with boolean', () => {
  const json = false

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with null', () => {
  const json = null

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with empty array', () => {
  const json: any = []

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with  array', () => {
  const json: any = [5, 4, 3]

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/0')).toBe(json[0])
  expect(util.jsonPointerGet(json, '/1')).toBe(json[1])
  expect(util.jsonPointerGet(json, '/2')).toBe(json[2])
})

test('jsonPointerGet test with  array', () => {
  const json: any = [5, 4, 3]

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/0')).toBe(json[0])
  expect(util.jsonPointerGet(json, '/1')).toBe(json[1])
  expect(util.jsonPointerGet(json, '/2')).toBe(json[2])
})

test('jsonPointerGet test with empty object', () => {
  const json: any = {}

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with  object', () => {
  const json: any = { level1: { level2: { level3: 3 } }, testarray: [1, 'abc'] }

  expect(util.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(util.jsonPointerGet(null, '')).toBe(undefined)
  expect(util.jsonPointerGet(false)).toBe(undefined)
  expect(util.jsonPointerGet(undefined)).toBe(undefined)
  expect(util.jsonPointerGet({})).toBe(undefined)
  expect(util.jsonPointerGet([])).toBe(undefined)
  expect(util.jsonPointerGet('')).toBe(undefined)
  expect(util.jsonPointerGet('', '')).toBe(undefined)
  expect(util.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(util.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, '/adsad')).toBe(undefined)
  expect(util.jsonPointerGet(json, 'level1')).toBe(json.level1)
  expect(util.jsonPointerGet(json, '/level1')).toBe(json.level1)
  expect(util.jsonPointerGet(json, '/level1/level2')).toBe(json.level1.level2)
  expect(util.jsonPointerGet(json, '/level1/level2/level3')).toBe(json.level1.level2.level3)
  expect(util.jsonPointerGet(json, '/level1/testarray')).toBe(json.level1.testarray)
  expect(util.jsonPointerGet(json, '/testarray/0')).toBe(json.testarray[0])
  expect(util.jsonPointerGet(json, '/testarray/1')).toBe(json.testarray[1])
  expect(util.jsonPointerGet(json, '/testarray/assd')).toBe(undefined)
})

test('jsonPointerSet test with object', () => {
  let json: any = null
  util.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual(null)
  json = undefined
  util.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual(undefined)
  json = ''
  util.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual('')
  json = ''
  util.jsonPointerSet(json, undefined, 4)
  expect(json).toEqual('')
  json = ''
  util.jsonPointerSet(json, undefined, null)
  expect(json).toEqual('')
  json = { a: 4 }
  util.jsonPointerSet(json, '/', false)

  expect(json).toEqual(false)
})
