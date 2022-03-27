import Ajv from 'ajv'
import keyValueReplace from 'key-value-replace'

interface I18nResources {
  [key: string]: {
    translation: {
      [key: string]: string
    }
  }
}

interface I18nProps {
  language?: string
  resources?: I18nResources
  keyPrefix?: string
  keyPostfix?: string
  nonExistsHandler?: (key: string) => void
}
const I18nSchema = {
  $id: 'http://example.com/schemas/schema.json',
  type: 'object',
  additionalProperties: {
    type: 'object',
    properties: {
      translation: {
        type: 'object',
        additionalProperties: {
          type: 'string',
        },
        propertyNames: {
          type: 'string',
        },
        minProperties: 1,
      },
      additionalProperties: false,
    },
  },
  propertyNames: {
    pattern: '^[A-Za-z0-9_-]*$',
    type: 'string',
  },
  minProperties: 1,
}

export default class I18n {
  language: string

  languages: string[]

  resources?: I18nResources

  keyPrefix?: string

  keyPostfix?: string

  nonExistsHandler?: (key: string) => void

  availableLanguageKey?: string

  // eslint-disable-next-line consistent-this
  constructor({ language = 'en', resources, nonExistsHandler, keyPrefix = '{{', keyPostfix = '}}' }: I18nProps) {
    this.language = language
    this.nonExistsHandler = nonExistsHandler
    this.keyPrefix = keyPrefix
    this.keyPostfix = keyPostfix

    const ajv = new Ajv()
    const validate = ajv.compile(I18nSchema)
    const isValid = validate(resources)
    if (isValid) {
      this.resources = resources
    }
    this.languages = Object.keys(resources as any)
    if (this.languages && this.languages.includes(this.language)) {
      this.availableLanguageKey = this.language
    } else if (this.languages && this.languages.includes(this.getLocales())) {
      this.availableLanguageKey = this.getLocales()
    }
  }

  getLocales = () => (this.language.includes('-') ? this.language.split('-') : this.language.split('_') || [])[0]

  t = (key: any, options?: any, language?: string | null) => {
    if (!(typeof key === 'string')) {
      return key
    }
    if (!this.resources || (!this.resources && !this.language && !language) || !this.resources[`${this.availableLanguageKey || language}`]) {
      return key
    }
    const value = this.resources[`${this.availableLanguageKey || language}`].translation[key]
    if (value === undefined) {
      if (this.nonExistsHandler && typeof this.nonExistsHandler === 'function') {
        return this.nonExistsHandler(key)
      }
      return key
    }
    if (options) {
      return keyValueReplace(value, options, [this.keyPrefix, this.keyPostfix])
    }
    return value
  }
}
