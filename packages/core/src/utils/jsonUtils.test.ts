import * as utils from './jsonUtils'
import * as c from './constants'

test('isNumber test', () => {
  expect(utils.isNumber(2)).toBe(true)
  expect(utils.isNumber(null)).toBe(false)
  expect(utils.isNumber('0')).toBe(false)
})

test('jsonPointerGet test with string', () => {
  const json = 'asdasd'

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with number', () => {
  const json = 33

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with boolean', () => {
  const json = true

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with boolean', () => {
  const json = false

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with null', () => {
  const json = null

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with empty array', () => {
  const json: any = []

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with  array', () => {
  const json: any = [5, 4, 3]

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/0')).toBe(json[0])
  expect(utils.jsonPointerGet(json, '/1')).toBe(json[1])
  expect(utils.jsonPointerGet(json, '/2')).toBe(json[2])
})

test('jsonPointerGet test with  array', () => {
  const json: any = [5, 4, 3]

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/0')).toBe(json[0])
  expect(utils.jsonPointerGet(json, '/1')).toBe(json[1])
  expect(utils.jsonPointerGet(json, '/2')).toBe(json[2])
})

test('jsonPointerGet test with empty object', () => {
  const json: any = {}

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
})

test('jsonPointerGet test with  object', () => {
  const json: any = { level1: { level2: { level3: 3 } }, testarray: [1, 'abc'] }

  expect(utils.jsonPointerGet(null, undefined)).toBe(undefined)
  expect(utils.jsonPointerGet(null, '')).toBe(undefined)
  expect(utils.jsonPointerGet(false)).toBe(undefined)
  expect(utils.jsonPointerGet(undefined)).toBe(undefined)
  expect(utils.jsonPointerGet({})).toBe(undefined)
  expect(utils.jsonPointerGet([])).toBe(undefined)
  expect(utils.jsonPointerGet('')).toBe(undefined)
  expect(utils.jsonPointerGet('', '')).toBe(undefined)
  expect(utils.jsonPointerGet(json, c.SEPARATOR)).toBe(json)
  expect(utils.jsonPointerGet(json, 'adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, '/adsad')).toBe(undefined)
  expect(utils.jsonPointerGet(json, 'level1')).toBe(json.level1)
  expect(utils.jsonPointerGet(json, '/level1')).toBe(json.level1)
  expect(utils.jsonPointerGet(json, '/level1/level2')).toBe(json.level1.level2)
  expect(utils.jsonPointerGet(json, '/level1/level2/level3')).toBe(json.level1.level2.level3)
  expect(utils.jsonPointerGet(json, '/level1/testarray')).toBe(json.level1.testarray)
  expect(utils.jsonPointerGet(json, '/testarray/0')).toBe(json.testarray[0])
  expect(utils.jsonPointerGet(json, '/testarray/1')).toBe(json.testarray[1])
  expect(utils.jsonPointerGet(json, '/testarray/assd')).toBe(undefined)
})

test('jsonPointerSet test', () => {
  let json: any = null
  json = utils.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual(null)

  json = undefined
  json = utils.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual(undefined)

  json = ''
  json = utils.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual('')

  json = ''
  json = utils.jsonPointerSet(json, undefined, 4)
  expect(json).toEqual('')

  json = ''
  json = utils.jsonPointerSet(json, undefined, null)
  expect(json).toEqual('')

  json = { a: 4 }
  json = utils.jsonPointerSet(json, '/', false)
  expect(json).toEqual(false)

  json = 'aa'
  json = utils.jsonPointerSet(json, '/', {})
  expect(json).toEqual({})

  json = null
  json = utils.jsonPointerSet(json, '/', { aaa: 3 })
  expect(json).toEqual({ aaa: 3 })

  json = { aaa: 2 }
  json = utils.jsonPointerSet(json, '/', 5)
  expect(json).toEqual(5)

  json = { aaa: 2 }
  json = utils.jsonPointerSet(json, '/', 'qweqwe')
  expect(json).toEqual('qweqwe')

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = utils.jsonPointerSet(json, '/level1/level2', 'qweqwe')
  expect(json).toEqual({ level1: { level2: 'qweqwe' } })

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = utils.jsonPointerSet(json, 'level1/level2', 'qweqwe')
  expect(json).toEqual({ level1: { level2: 'qweqwe' } })

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = utils.jsonPointerSet(json, 'level1/level2', { level4: 'ok' })
  expect(json).toEqual({ level1: { level2: { level4: 'ok' } } })

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = utils.jsonPointerSet(json, 'level1/+', 'ok')
  expect(json).toEqual({ level1: { level2: { level3: { endlevel: false } }, '+': 'ok' } })

  json = { level1: { level2: [1, 5, 8] } }
  json = utils.jsonPointerSet(json, 'level1/level2/1', 'ok')
  expect(json).toEqual({ level1: { level2: [1, 'ok', 8] } })

  json = { level1: { level2: [1, 5, 8] } }
  json = utils.jsonPointerSet(json, 'level1/level2/0', 'ok')
  expect(json).toEqual({ level1: { level2: ['ok', 5, 8] } })

  json = { level1: { level2: [1, 5, 8] } }
  json = utils.jsonPointerSet(json, 'level1/level2/-', 'ok')
  expect(json).toEqual({ level1: { level2: [1, 5, 8, 'ok'] } })

  json = { level1: { level2: [] } }
  json = utils.jsonPointerSet(json, 'level1/level2/-', 'ok')
  expect(json).toEqual({ level1: { level2: ['ok'] } })

  json = { level1: { level2: [] } }
  json = utils.jsonPointerSet(json, 'level1/level2/1', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [undefined, { aaa: 3 }] } })

  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = utils.jsonPointerSet(json, 'level1/level2/2', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [1, 4, { aaa: 3 }] } })

  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = utils.jsonPointerSet(json, 'level1/level2/2', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [1, 4, { aaa: 3 }] } })

  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = utils.jsonPointerSet(json, 'level1/level2/1', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [1, { aaa: 3 }, { ccc: 6 }] } })

  // TODO means, we need to add a normalize function, to delete a key or array item from the listy if the value is undefined
  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = utils.jsonPointerSet(json, 'level1/level2/2', undefined)
  expect(json).toEqual({ level1: { level2: [1, 4, undefined] } })
})

test('pathArrayToPathString test', () => {
  expect(utils.pathArrayToPathString(['a', 'b', 'c', 'd'])).toBe('a.b.c.d')
  expect(utils.pathArrayToPathString(['a', '', 'c', 'd'])).toBe('a..c.d')
  expect(utils.pathArrayToPathString(['a', '1', 'c', 'd'])).toBe('a.1.c.d')
  expect(utils.pathArrayToPathString(['a', 1, 'c', 'd'])).toBe('a[1].c.d')
})

test('pathArrayToJsonPointer test', () => {
  expect(utils.pathArrayToJsonPointer(['a', 'b', 'c', 'd'])).toBe('/a/b/c/d')
  expect(utils.pathArrayToJsonPointer(['a', '', 'c', 'd'])).toBe('/a//c/d')
  expect(utils.pathArrayToJsonPointer(['a', '1', 'c', 'd'])).toBe('/a/1/c/d')
  expect(utils.pathArrayToJsonPointer(['a', 1, 'c', 'd'])).toBe('/a/1/c/d')
})

test('isOnlyObject test', () => {
  expect(utils.isOnlyObject(['a', 'b', 'c', 'e'])).toBe(false)
  expect(utils.isOnlyObject(null)).toBe(false)
  expect(utils.isOnlyObject(undefined)).toBe(false)
  expect(utils.isOnlyObject(false)).toBe(false)
  expect(utils.isOnlyObject(true)).toBe(false)
  expect(utils.isOnlyObject(224)).toBe(false)
  expect(utils.isOnlyObject('asd')).toBe(false)
  expect(utils.isOnlyObject({})).toBe(true)
  expect(utils.isOnlyObject({})).toBe(true)
})

test('mergePath test', () => {
  const origarray = ['a', 'b', 'c', 'e']
  const origobj = { level1: { level2: { ee: false } } }
  expect(utils.mergePath(origarray, 5)).toBe(origarray)
  expect(utils.mergePath(origarray, '5')).toBe(origarray)
  expect(utils.mergePath(origarray, undefined)).toBe(origarray)
  expect(utils.mergePath(origarray, null)).toBe(origarray)
  expect(utils.mergePath(origarray, false)).toBe(origarray)
  expect(utils.mergePath(origarray, true)).toBe(origarray)

  expect(utils.mergePath(origobj, { bb: 'tt' })).toEqual({ level1: { level2: { ee: false } }, bb: 'tt' })
  expect(utils.mergePath(origobj, { level1: 'tt' })).toEqual({ level1: 'tt' })
  expect(utils.mergePath(origobj, { 'level1/level2': 'tt' })).toEqual({ level1: { level2: 'tt' } })
  expect(utils.mergePath(origobj, { 'level1/level2': 'tt', anotherlevel: 3 })).toEqual({ anotherlevel: 3, level1: { level2: 'tt' } })
})

test('changeRelativePath test', () => {
  expect(utils.changeRelativePath('')).toBe('')
  expect(utils.changeRelativePath('/')).toBe('')
  expect(utils.changeRelativePath('/lev1/lev2/lev3/')).toBe('/lev1/lev2/lev3')
  expect(utils.changeRelativePath('/lev1/lev2/lev3')).toBe('/lev1/lev2/lev3')
  expect(utils.changeRelativePath('/lev1/lev2/lev3/.')).toBe('/lev1/lev2/lev3')
  expect(utils.changeRelativePath('/lev1/lev2/./lev3')).toBe('/lev1/lev2/lev3')
  expect(utils.changeRelativePath('/lev1/lev2/lev3/..')).toBe('/lev1/lev2')
  expect(utils.changeRelativePath('/lev1/lev2/lev3/../../')).toBe('/lev1')
  expect(utils.changeRelativePath('/lev1/lev2/lev3/../../levaaa')).toBe('/lev1/levaaa')
  expect(utils.changeRelativePath('/lev1/lev2/lev3/../../levaaa/../')).toBe('/lev1')
  expect(utils.changeRelativePath('/lev1/lev2/lev3/././levaaa/../')).toBe('/lev1/lev2/lev3')
  expect(utils.changeRelativePath('/../aaa')).toBe('/aaa')
  expect(utils.changeRelativePath('/bbb/../../aaa')).toBe('/aaa')
  expect(utils.changeRelativePath('/bbb/../cc./../../aaa')).toBe('/aaa')
  expect(utils.changeRelativePath('/../aaa')).toBe('/aaa')
  expect(utils.changeRelativePath('/bbb/../cc/../aaa')).toBe('/aaa')
  expect(utils.changeRelativePath('/bbb/hhh/../cc/../aaa')).toBe('/bbb/aaa')
})

test('mergeDeep test', () => {
  expect(utils.mergeDeep(['a', 'b', 'c', 'e'])).toEqual(['a', 'b', 'c', 'e'])
  expect(utils.mergeDeep(['a', 'b', 'c', 'e'], 5)).toEqual(['a', 'b', 'c', 'e'])
  expect(utils.mergeDeep(['a', 'b', 'c', 'e'], '5')).toEqual(['a', 'b', 'c', 'e'])
  expect(utils.mergeDeep(['a', 'b', 'c', 'e'], undefined)).toEqual(['a', 'b', 'c', 'e'])
  expect(utils.mergeDeep(['a', 'b', 'c', 'e'], null)).toEqual(['a', 'b', 'c', 'e'])
  expect(utils.mergeDeep(['a', 'b', 'c', 'e'], false)).toEqual(['a', 'b', 'c', 'e'])
  expect(utils.mergeDeep(['a', 'b', 'c', 'e'], true)).toEqual(['a', 'b', 'c', 'e'])

  expect(utils.mergeDeep({ aa: 's', bb: 'w' })).toEqual({ aa: 's', bb: 'w' })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, 5)).toEqual({ aa: 's', bb: 'w' })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, '5')).toEqual({ aa: 's', bb: 'w' })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, undefined)).toEqual({ aa: 's', bb: 'w' })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, null)).toEqual({ aa: 's', bb: 'w' })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, false)).toEqual({ aa: 's', bb: 'w' })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, true)).toEqual({ aa: 's', bb: 'w' })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, { aa: 'ee', cc: 3 })).toEqual({ aa: 'ee', bb: 'w', cc: 3 })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, { aa: 'ee', cc: 3 }, { cc: 'ww', tt: 6 })).toEqual({ aa: 'ee', bb: 'w', cc: 'ww', tt: 6 })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, { aa: { g: 7 }, cc: 3 })).toEqual({ aa: 's', bb: 'w', cc: 3 })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, { aa: undefined, cc: 3 })).toEqual({ aa: undefined, bb: 'w', cc: 3 })
  expect(utils.mergeDeep({ aa: 's', bb: 'w' }, { aa: null, cc: 3 })).toEqual({ aa: null, bb: 'w', cc: 3 })
  expect(utils.mergeDeep({ aa: 's', bb: { tt: 3 } }, { bb: { tt: 5 } })).toEqual({ aa: 's', bb: { tt: 5 } })
  expect(utils.mergeDeep({ aa: 's', bb: { tt: 3 } }, { bb: undefined })).toEqual({ aa: 's', bb: undefined })
  expect(utils.mergeDeep({ aa: 's', bb: { tt: 3 } }, { bb: null })).toEqual({ aa: 's', bb: null })
})

test('findLastIndex test', () => {
  expect(utils.findLastIndex(['a', 'b', 'c', 'e'], (i: any) => i === 'e')).toEqual(3)
  expect(utils.findLastIndex(['a', '', 'b', 'c', '', 'e'], (i: any) => i === '')).toEqual(4)
  expect(utils.findLastIndex(['', '', 'b', 'c', ''], (i: any) => i === '')).toEqual(4)
  expect(utils.findLastIndex(['a', 'b', 'c', 'e'], (i: any) => i === 'ee')).toEqual(-1)
  expect(utils.findLastIndex([], (i: any) => i === 'e')).toEqual(-1)
})

test('drop test', () => {
  expect(utils.drop(['a', 'b', 'c', 'e'], 1)).toEqual(['b', 'c', 'e'])
  expect(utils.drop(['a', 'b'], 1)).toEqual(['b'])
  expect(utils.drop(['a'], 1)).toEqual([])
  expect(utils.drop(['a'], 0)).toEqual(['a'])
  expect(utils.drop(['a', 'b', 'c', 'e'], 2)).toEqual(['c', 'e'])
})

test('collectObjMerge test', () => {
  const json = { test: 999, level1: { test: { any: 7 }, '': 8, level2: { test: { any: 7 }, level3: { test: { another: 3, any: 8 } } } } }
  const realisticJson = {
    $locales: {
      en: {
        translation: {
          'This is an e-mail placeholder': 'Just placeholder1',
          Hi: 'Hi in English! 1',
        },
      },
      hu: {
        translation: {
          'This is an e-mail placeholder': 'Ez egy helykitöltő1',
          testhu1: 'Hogy vagy??',
        },
      },
    },
    level1: {
      $locales: {
        en: {
          translation: {
            'This is an e-mail placeholder': 'Just placeholder2',
            Hi: 'Hi in English! 1',
            testen2: 'Hogy vagy??',
          },
        },
        hu: {
          translation: {
            'This is an e-mail placeholder': 'Ez egy helykitöltő2',
            Hi: 'Hogy vagy??',
            testhu3: 'Hogy vagy??',
          },
        },
      },
      level3: {
        $locales: {
          en: {
            translation: {
              'This is an e-mail placeholder': 'Just placeholder3',
              Hi: 'Hi in English! 1',
              testen4: 'Hogy vagy??',
            },
          },
          hu: {
            translation: {
              'This is an e-mail placeholder': 'Ez egy helykitöltő3',
              Hi: 'Hogy vagy??',
            },
          },
        },
      },
    },
  }
  expect(utils.collectObjMerge('test', json)).toEqual({ another: 3, any: 8 })
  expect(utils.collectObjMerge('any', json)).toEqual({})
  expect(utils.collectObjMerge('$locales', realisticJson)).toEqual({
    en: {
      translation: {
        Hi: 'Hi in English! 1',
        'This is an e-mail placeholder': 'Just placeholder3',
        testen2: 'Hogy vagy??',
        testen4: 'Hogy vagy??',
      },
    },
    hu: {
      translation: {
        Hi: 'Hogy vagy??',
        'This is an e-mail placeholder': 'Ez egy helykitöltő3',
        testhu1: 'Hogy vagy??',
        testhu3: 'Hogy vagy??',
      },
    },
  })
})

test('collectObjToArray test', () => {
  const json = { test: 999, level1: { test: { any: 7 }, '': 8, level2: { test: { any: 7 }, level3: { test: { another: 3, any: 8 } } } } }
  expect(utils.collectObjToArray('test', json)).toEqual([999, { any: 7 }, { any: 7 }, { another: 3, any: 8 }])
  expect(utils.collectObjToArray('any', json)).toEqual([7, 7, 8])
  const realisticJson = {
    $validations: [
      {
        data: 1,
        path: '/elso/masodik',
        store: 'data',
      },
      {
        data: 2,
        path: '/elso/masodik',
        store: 'data',
      },
    ],
    level1: {
      $validations: [
        {
          data: 3,
          path: '/elso/masodik',
          store: 'data',
        },
      ],
      level2: {
        $validations: [
          {
            data: 4,
            path: '/elso/harmadik',
            store: 'data',
          },
        ],
      },
    },
  }
  expect(utils.collectObjToArray('$validations', realisticJson, true)).toEqual([
    {
      data: 1,
      path: '/elso/masodik',
      store: 'data',
    },
    {
      data: 2,
      path: '/elso/masodik',
      store: 'data',
    },
    {
      data: 3,
      path: '/elso/masodik',
      store: 'data',
    },
    {
      data: 4,
      path: '/elso/harmadik',
      store: 'data',
    },
  ])
})

test('isValidJson test', () => {
  expect(utils.isValidJson('')).toBe(true)
  expect(utils.isValidJson(null)).toBe(true)
  expect(utils.isValidJson(undefined)).toBe(true)
  expect(utils.isValidJson({})).toBe(true)
  expect(utils.isValidJson(false)).toBe(true)
  expect(utils.isValidJson(true)).toBe(true)
  const funcTest = () => {
    // eslint-disable-next-line no-console
    console.log('')
  }
  expect(utils.isValidJson(funcTest)).toBe(true)
  const a: any = { a: 2, b: 5 }
  expect(utils.isValidJson(a)).toBe(true)
  a.b = a
  expect(utils.isValidJson(a)).toBe(false)
})

test('isPrimitiveValue test emptyStringAllowed false', () => {
  expect(utils.isPrimitiveValue('', false)).toBe(false)
  expect(utils.isPrimitiveValue('a', false)).toBe(true)
  expect(utils.isPrimitiveValue(6, false)).toBe(true)
  expect(utils.isPrimitiveValue(BigInt(9007199254740991), false)).toBe(true)
  expect(utils.isPrimitiveValue(null, false)).toBe(false)
  expect(utils.isPrimitiveValue(undefined, false)).toBe(false)
  expect(utils.isPrimitiveValue({}, false)).toBe(false)
  expect(utils.isPrimitiveValue([], false)).toBe(false)
  expect(utils.isPrimitiveValue(false, false)).toBe(true)
  expect(utils.isPrimitiveValue(true, false)).toBe(true)
  const a: any = { a: 2, b: 5 }
  expect(utils.isPrimitiveValue(a, false)).toBe(false)
  a.b = a
  expect(utils.isPrimitiveValue(a, false)).toBe(false)
})

test('isPrimitiveValue test emptyStringAllowed true', () => {
  expect(utils.isPrimitiveValue('', true)).toBe(true)
  expect(utils.isPrimitiveValue('a', true)).toBe(true)
  expect(utils.isPrimitiveValue(6, true)).toBe(true)
  expect(utils.isPrimitiveValue(BigInt(9007199254740991), true)).toBe(true)
  expect(utils.isPrimitiveValue(null, true)).toBe(false)
  expect(utils.isPrimitiveValue(undefined, true)).toBe(false)
  expect(utils.isPrimitiveValue({}, true)).toBe(false)
  expect(utils.isPrimitiveValue([], true)).toBe(false)
  expect(utils.isPrimitiveValue(false, true)).toBe(true)
  expect(utils.isPrimitiveValue(true, true)).toBe(true)
  const a: any = { a: 2, b: 5 }
  expect(utils.isPrimitiveValue(a, true)).toBe(false)
  a.b = a
  expect(utils.isPrimitiveValue(a, true)).toBe(false)
})

test('hasLeaf test emptyStringAllowed false', () => {
  expect(utils.hasLeaf('', false)).toBe(false)
  expect(utils.hasLeaf('a', false)).toBe(true)
  expect(utils.hasLeaf(6, false)).toBe(true)
  expect(utils.hasLeaf(BigInt(9007199254740991), false)).toBe(true)
  expect(utils.hasLeaf(null, false)).toBe(false)
  expect(utils.hasLeaf(undefined, false)).toBe(false)
  expect(utils.hasLeaf({}, false)).toBe(false)
  expect(utils.hasLeaf([], false)).toBe(false)
  expect(utils.hasLeaf(false, false)).toBe(true)
  expect(utils.hasLeaf(true, false)).toBe(true)
  const a: any = { a: 2, b: 5 }
  expect(utils.hasLeaf(a, false)).toBe(true)
  a.b = a
  expect(utils.hasLeaf(a, false)).toBe(true)

  expect(utils.hasLeaf({ a: { c: [] }, b: [], d: [], e: { g: {} }, w: null, t: undefined }, false)).toBe(false)
  expect(utils.hasLeaf({ a: { c: [5] }, b: [], d: [], e: { g: {} }, w: null, t: undefined }, false)).toBe(true)
  expect(utils.hasLeaf([[[[{}], {}], null, undefined], { w: null, t: undefined }], false)).toBe(false)
})
