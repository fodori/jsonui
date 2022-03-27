import I18n from './I18n'

test('I18n constructor test', () => {
  const language = 'en'
  const resources = { en: { translation: { 'This is a test': 'Test done', Hi: 'Hello' } } }
  const nonExistsHandler = (key: string) => `--${key}++`
  const keyPrefix = '{{'
  const keyPostfix = '}}'
  const instance = new I18n({ language, resources, nonExistsHandler, keyPrefix, keyPostfix })
  expect(instance.language).toBe('en')
  expect(instance.keyPrefix).toBe('{{')
  expect(instance.keyPostfix).toBe('}}')
  expect(instance.nonExistsHandler).toBe(nonExistsHandler)
  expect(instance.nonExistsHandler).toBe(nonExistsHandler)
  expect(instance.resources).toBe(resources)
})

test('I18n t test', () => {
  const resources = { en: { translation: { 'This is a test': 'Test done', Hi: 'Hello' } } }
  const nonExistsHandler = (key: string) => `--${key}++`
  const keyPrefix = '{{'
  const keyPostfix = '}}'
  const instance = new I18n({ language: 'en', resources, nonExistsHandler, keyPrefix, keyPostfix })
  expect(instance.getLocales()).toBe('en')
  expect(instance.t('')).toBe('--++')
  expect(instance.t(undefined)).toBe(undefined)
  expect(instance.t(null)).toBe(null)
  expect(instance.t(34)).toBe(34)
  expect(instance.t(34)).toBe(34)
  expect(instance.t('34')).toBe('--34++')
  expect(instance.t('Hi')).toBe('Hello')
  expect(instance.t('This is a test')).toBe('Test done')
})

test('I18n non exists language test', () => {
  const resources = { en: { translation: { 'This is a test': 'Test done', Hi: 'Hello' } } }
  const keyPrefix = '{{'
  const keyPostfix = '}}'
  const instance = new I18n({ language: 'non exists', resources, keyPrefix, keyPostfix })
  expect(instance.getLocales()).toBe('non exists')
  expect(instance.t('')).toBe('')
  expect(instance.t(undefined)).toBe(undefined)
  expect(instance.t(null)).toBe(null)
  expect(instance.t(34)).toBe(34)
  expect(instance.t(34)).toBe(34)
  expect(instance.t('34')).toBe('34')
  expect(instance.t('Hi')).toBe('Hi')
  expect(instance.t('This is a test')).toBe('This is a test')
})

test('I18n 2. language test', () => {
  const resources = {
    en: { translation: { 'This is a test': 'Test done', Hi: 'Hello' } },
    hu: {
      translation: {
        'This is a test': 'Teszt sikerült',
        Hi: 'Helló',
        testProperty: 'Test sentences {{number}}',
        testProperty1: 'Test sentences {{number}} {{number}}',
        testProperty2: 'Test sentences {{number}} {{number6}}',
      },
    },
  }
  const keyPrefix = '{{'
  const keyPostfix = '}}'
  const instance = new I18n({ language: 'hu', resources, keyPrefix, keyPostfix })
  expect(instance.getLocales()).toBe('hu')
  expect(instance.t('')).toBe('')
  expect(instance.t(undefined)).toBe(undefined)
  expect(instance.t(null)).toBe(null)
  expect(instance.t(34)).toBe(34)
  expect(instance.t(34)).toBe(34)
  expect(instance.t('34')).toBe('34')
  expect(instance.t('Hi')).toBe('Helló')
  expect(instance.t('This is a test')).toBe('Teszt sikerült')
  expect(instance.t('testProperty')).toBe('Test sentences {{number}}')
  expect(instance.t('testProperty', { number: 42 })).toBe('Test sentences 42')
  expect(instance.t('testProperty1', { number: 42 })).toBe('Test sentences 42 42')
  expect(instance.t('testProperty2', { number: 42 })).toBe('Test sentences 42 {{number6}}')
  expect(instance.t('testProperty2', { number: 42, number6: 6 })).toBe('Test sentences 42 6')
  expect(instance.t('testProperty2', {})).toBe('Test sentences {{number}} {{number6}}')
  expect(instance.t('testProperty2', null)).toBe('Test sentences {{number}} {{number6}}')
})

test('I18n nonExistsHandler test', () => {
  const resources = {
    en: { translation: { 'This is a test': 'Test done', Hi: 'Hello' } },
    hu: {
      translation: {
        'This is a test': 'Teszt sikerült',
        Hi: 'Helló',
        testProperty: 'Test sentences {{number}}',
        testProperty1: 'Test sentences {{number}} {{number}}',
        testProperty2: 'Test sentences {{number}} {{number6}}',
      },
    },
  }
  const nonExistsHandler = (key: string) => `--${key}++`
  const instance = new I18n({ language: 'hu', resources, nonExistsHandler })
  expect(instance.getLocales()).toBe('hu')
  expect(instance.t('aaaaa')).toBe('--aaaaa++')
  expect(instance.t('Hi')).toBe('Helló')
})
