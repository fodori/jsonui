import defaultsDeep from 'lodash/defaultsDeep'
import { constants as c, Stock, I18n, stockFunctions as functions, util } from '@jsonui/core'
import additionalComponents from './components'

// eslint-disable-next-line import/prefer-default-export
export const getStock = (stockInit: any, model: any, Wrapper: any, reduxStore: any) => {
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
    resources: util.collectObjMerge(c.REF_LOCALES, model),
  })

  // get Validations
  stock.validations = util.collectObjToArray(c.REF_VALIDATES, model, true)
  stock.registerFunction('t', (p) => i18n.t(p.keys, p.options))
  stock.registerFunction('test', () => 'Test is ok')
  return stock
}
const stock = {
  components: additionalComponents,
  functions,
}

export default stock
