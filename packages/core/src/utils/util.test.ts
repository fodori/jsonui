import * as util from './util'
import * as c from './constants'

test('isNumber test', () => {
  expect(util.isNumber(2)).toBe(true)
  expect(util.isNumber(null)).toBe(false)
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

test('jsonPointerSet test', () => {
  let json: any = null
  json = util.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual(null)

  json = undefined
  json = util.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual(undefined)

  json = ''
  json = util.jsonPointerSet(json, undefined, undefined)
  expect(json).toEqual('')

  json = ''
  json = util.jsonPointerSet(json, undefined, 4)
  expect(json).toEqual('')

  json = ''
  json = util.jsonPointerSet(json, undefined, null)
  expect(json).toEqual('')

  json = { a: 4 }
  json = util.jsonPointerSet(json, '/', false)
  expect(json).toEqual(false)

  json = 'aa'
  json = util.jsonPointerSet(json, '/', {})
  expect(json).toEqual({})

  json = null
  json = util.jsonPointerSet(json, '/', { aaa: 3 })
  expect(json).toEqual({ aaa: 3 })

  json = { aaa: 2 }
  json = util.jsonPointerSet(json, '/', 5)
  expect(json).toEqual(5)

  json = { aaa: 2 }
  json = util.jsonPointerSet(json, '/', 'qweqwe')
  expect(json).toEqual('qweqwe')

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = util.jsonPointerSet(json, '/level1/level2', 'qweqwe')
  expect(json).toEqual({ level1: { level2: 'qweqwe' } })

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = util.jsonPointerSet(json, 'level1/level2', 'qweqwe')
  expect(json).toEqual({ level1: { level2: 'qweqwe' } })

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = util.jsonPointerSet(json, 'level1/level2', { level4: 'ok' })
  expect(json).toEqual({ level1: { level2: { level4: 'ok' } } })

  json = { level1: { level2: { level3: { endlevel: false } } } }
  json = util.jsonPointerSet(json, 'level1/+', 'ok')
  expect(json).toEqual({ level1: { level2: { level3: { endlevel: false } }, '+': 'ok' } })

  json = { level1: { level2: [1, 5, 8] } }
  json = util.jsonPointerSet(json, 'level1/level2/1', 'ok')
  expect(json).toEqual({ level1: { level2: [1, 'ok', 8] } })

  json = { level1: { level2: [1, 5, 8] } }
  json = util.jsonPointerSet(json, 'level1/level2/0', 'ok')
  expect(json).toEqual({ level1: { level2: ['ok', 5, 8] } })

  json = { level1: { level2: [1, 5, 8] } }
  json = util.jsonPointerSet(json, 'level1/level2/-', 'ok')
  expect(json).toEqual({ level1: { level2: [1, 5, 8, 'ok'] } })

  json = { level1: { level2: [] } }
  json = util.jsonPointerSet(json, 'level1/level2/-', 'ok')
  expect(json).toEqual({ level1: { level2: ['ok'] } })

  json = { level1: { level2: [] } }
  json = util.jsonPointerSet(json, 'level1/level2/1', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [undefined, { aaa: 3 }] } })

  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = util.jsonPointerSet(json, 'level1/level2/2', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [1, 4, { aaa: 3 }] } })

  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = util.jsonPointerSet(json, 'level1/level2/2', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [1, 4, { aaa: 3 }] } })

  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = util.jsonPointerSet(json, 'level1/level2/1', { aaa: 3 })
  expect(json).toEqual({ level1: { level2: [1, { aaa: 3 }, { ccc: 6 }] } })

  // TODO means, we need to add a normalize function, to delete a key or array item from the listy if the value is undefined
  json = { level1: { level2: [1, 4, { ccc: 6 }] } }
  json = util.jsonPointerSet(json, 'level1/level2/2', undefined)
  expect(json).toEqual({ level1: { level2: [1, 4, undefined] } })
})

test('pathArrayToPathString test', () => {
  expect(util.pathArrayToPathString(['a', 'b', 'c', 'd'])).toBe('a.b.c.d')
  expect(util.pathArrayToPathString(['a', '', 'c', 'd'])).toBe('a..c.d')
  expect(util.pathArrayToPathString(['a', '1', 'c', 'd'])).toBe('a.1.c.d')
  expect(util.pathArrayToPathString(['a', 1, 'c', 'd'])).toBe('a[1].c.d')
})

test('pathArrayToJsonPointer test', () => {
  expect(util.pathArrayToJsonPointer(['a', 'b', 'c', 'd'])).toBe('/a/b/c/d')
  expect(util.pathArrayToJsonPointer(['a', '', 'c', 'd'])).toBe('/a//c/d')
  expect(util.pathArrayToJsonPointer(['a', '1', 'c', 'd'])).toBe('/a/1/c/d')
  expect(util.pathArrayToJsonPointer(['a', 1, 'c', 'd'])).toBe('/a/1/c/d')
})

test('isOnlyObject test', () => {
  expect(util.isOnlyObject(['a', 'b', 'c', 'e'])).toBe(false)
  expect(util.isOnlyObject(null)).toBe(false)
  expect(util.isOnlyObject(undefined)).toBe(false)
  expect(util.isOnlyObject(false)).toBe(false)
  expect(util.isOnlyObject(true)).toBe(false)
  expect(util.isOnlyObject(224)).toBe(false)
  expect(util.isOnlyObject('asd')).toBe(false)
  expect(util.isOnlyObject({})).toBe(true)
  expect(util.isOnlyObject({})).toBe(true)
})

test('mergePath test', () => {
  const origarray = ['a', 'b', 'c', 'e']
  const origobj = { level1: { level2: { ee: false } } }
  expect(util.mergePath(origarray, 5)).toBe(origarray)
  expect(util.mergePath(origarray, '5')).toBe(origarray)
  expect(util.mergePath(origarray, undefined)).toBe(origarray)
  expect(util.mergePath(origarray, null)).toBe(origarray)
  expect(util.mergePath(origarray, false)).toBe(origarray)
  expect(util.mergePath(origarray, true)).toBe(origarray)

  expect(util.mergePath(origobj, { bb: 'tt' })).toEqual({ level1: { level2: { ee: false } }, bb: 'tt' })
  expect(util.mergePath(origobj, { level1: 'tt' })).toEqual({ level1: 'tt' })
  expect(util.mergePath(origobj, { 'level1/level2': 'tt' })).toEqual({ level1: { level2: 'tt' } })
  expect(util.mergePath(origobj, { 'level1/level2': 'tt', anotherlevel: 3 })).toEqual({ anotherlevel: 3, level1: { level2: 'tt' } })
})

test('changeRelativePath test', () => {
  expect(util.changeRelativePath('')).toBe('')
  expect(util.changeRelativePath('/')).toBe('')
  expect(util.changeRelativePath('/lev1/lev2/lev3/')).toBe('/lev1/lev2/lev3')
  expect(util.changeRelativePath('/lev1/lev2/lev3')).toBe('/lev1/lev2/lev3')
  expect(util.changeRelativePath('/lev1/lev2/lev3/.')).toBe('/lev1/lev2/lev3')
  expect(util.changeRelativePath('/lev1/lev2/./lev3')).toBe('/lev1/lev2/lev3')
  expect(util.changeRelativePath('/lev1/lev2/lev3/..')).toBe('/lev1/lev2')
  expect(util.changeRelativePath('/lev1/lev2/lev3/../../')).toBe('/lev1')
  expect(util.changeRelativePath('/lev1/lev2/lev3/../../levaaa')).toBe('/lev1/levaaa')
  expect(util.changeRelativePath('/lev1/lev2/lev3/../../levaaa/../')).toBe('/lev1')
  expect(util.changeRelativePath('/lev1/lev2/lev3/././levaaa/../')).toBe('/lev1/lev2/lev3')
})

test('mergeDeep test', () => {
  expect(util.mergeDeep(['a', 'b', 'c', 'e'])).toEqual(['a', 'b', 'c', 'e'])
  expect(util.mergeDeep(['a', 'b', 'c', 'e'], 5)).toEqual(['a', 'b', 'c', 'e'])
  expect(util.mergeDeep(['a', 'b', 'c', 'e'], '5')).toEqual(['a', 'b', 'c', 'e'])
  expect(util.mergeDeep(['a', 'b', 'c', 'e'], undefined)).toEqual(['a', 'b', 'c', 'e'])
  expect(util.mergeDeep(['a', 'b', 'c', 'e'], null)).toEqual(['a', 'b', 'c', 'e'])
  expect(util.mergeDeep(['a', 'b', 'c', 'e'], false)).toEqual(['a', 'b', 'c', 'e'])
  expect(util.mergeDeep(['a', 'b', 'c', 'e'], true)).toEqual(['a', 'b', 'c', 'e'])

  expect(util.mergeDeep({ aa: 's', bb: 'w' })).toEqual({ aa: 's', bb: 'w' })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, 5)).toEqual({ aa: 's', bb: 'w' })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, '5')).toEqual({ aa: 's', bb: 'w' })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, undefined)).toEqual({ aa: 's', bb: 'w' })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, null)).toEqual({ aa: 's', bb: 'w' })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, false)).toEqual({ aa: 's', bb: 'w' })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, true)).toEqual({ aa: 's', bb: 'w' })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, { aa: 'ee', cc: 3 })).toEqual({ aa: 'ee', bb: 'w', cc: 3 })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, { aa: 'ee', cc: 3 }, { cc: 'ww', tt: 6 })).toEqual({ aa: 'ee', bb: 'w', cc: 'ww', tt: 6 })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, { aa: { g: 7 }, cc: 3 })).toEqual({ aa: 's', bb: 'w', cc: 3 })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, { aa: undefined, cc: 3 })).toEqual({ aa: undefined, bb: 'w', cc: 3 })
  expect(util.mergeDeep({ aa: 's', bb: 'w' }, { aa: null, cc: 3 })).toEqual({ aa: null, bb: 'w', cc: 3 })
  expect(util.mergeDeep({ aa: 's', bb: { tt: 3 } }, { bb: { tt: 5 } })).toEqual({ aa: 's', bb: { tt: 5 } })
  expect(util.mergeDeep({ aa: 's', bb: { tt: 3 } }, { bb: undefined })).toEqual({ aa: 's', bb: undefined })
  expect(util.mergeDeep({ aa: 's', bb: { tt: 3 } }, { bb: null })).toEqual({ aa: 's', bb: null })
})

test('findLastIndex test', () => {
  expect(util.findLastIndex(['a', 'b', 'c', 'e'], (i: any) => i === 'e')).toEqual(3)
  expect(util.findLastIndex(['a', '', 'b', 'c', '', 'e'], (i: any) => i === '')).toEqual(4)
  expect(util.findLastIndex(['', '', 'b', 'c', ''], (i: any) => i === '')).toEqual(4)
  expect(util.findLastIndex(['a', 'b', 'c', 'e'], (i: any) => i === 'ee')).toEqual(-1)
  expect(util.findLastIndex([], (i: any) => i === 'e')).toEqual(-1)
})

test('drop test', () => {
  expect(util.drop(['a', 'b', 'c', 'e'], 1)).toEqual(['b', 'c', 'e'])
  expect(util.drop(['a', 'b'], 1)).toEqual(['b'])
  expect(util.drop(['a'], 1)).toEqual([])
  expect(util.drop(['a'], 0)).toEqual(['a'])
  expect(util.drop(['a', 'b', 'c', 'e'], 2)).toEqual(['c', 'e'])
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
  expect(util.collectObjMerge('test', json)).toEqual({ another: 3, any: 8 })
  expect(util.collectObjMerge('any', json)).toEqual({})
  expect(util.collectObjMerge('$locales', realisticJson)).toEqual({
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
  const realisticJson = {
    $validations: [
      {
        data: 1,
        path: '/elso/masodik',
        store: 'data',
      },
    ],
    level1: {
      $validations: [
        {
          data: 2,
          path: '/elso/masodik',
          store: 'data',
        },
      ],
      level2: {
        $validations: [
          {
            data: 3,
            path: '/elso/harmadik',
            store: 'data',
          },
        ],
      },
    },
  }
  expect(util.collectObjToArray('test', json)).toEqual([999, { any: 7 }, { any: 7 }, { another: 3, any: 8 }])
  expect(util.collectObjToArray('any', json)).toEqual([7, 7, 8])
  expect(util.collectObjToArray('$validations', realisticJson)).toEqual([
    [
      {
        data: 1,
        path: '/elso/masodik',
        store: 'data',
      },
    ],
    [
      {
        data: 2,
        path: '/elso/masodik',
        store: 'data',
      },
    ],
    [
      {
        data: 3,
        path: '/elso/harmadik',
        store: 'data',
      },
    ],
  ])
})
