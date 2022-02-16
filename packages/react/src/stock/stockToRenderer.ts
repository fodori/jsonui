import defaultsDeep from 'lodash/defaultsDeep'
import { constants as c, Stock, I18n, stockFunctions as functions, jsonRefResolver } from '@jsonui/core'
import additionalComponents from './components'

const { collectJsonKeys } = jsonRefResolver

// eslint-disable-next-line import/prefer-default-export
export const getStock = (stockInit: any, viewDef: any, Wrapper: any, reduxStore: any) => {
  const stock = new Stock(
    defaultsDeep(stockInit, {
      components: additionalComponents,
      functions,
    }),
    Wrapper,
    reduxStore
  )
  const i18n = new I18n({
    language:
      (navigator.languages && navigator.languages[0]) || // Chrome / Firefox
      navigator.language || // All browsers
      (navigator as any).userLanguage, // IE <= 10
    resources: collectJsonKeys(c.REF_LOCALES, viewDef),
  })

  // get Validations
  stock.validations = jsonRefResolver.getRefs(c.REF_VALIDATES, viewDef).flat(Infinity)
  stock.registerFunction('t', (p) => i18n.t(p.keys, p.options))
  stock.registerFunction('test', () => 'Test is ok')
  return stock
}
const stock = {
  components: additionalComponents,
  functions,
}

export default stock
