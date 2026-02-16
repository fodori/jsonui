import { getStateValue } from '../store/root/selectors'
import { set as setAction } from '../store/root/actions'
import { JsonUIFunctionType, PathModifiersType } from '../utils/types'
import * as c from '../utils/constants'
import jsonataObj from 'jsonata'

const get: JsonUIFunctionType = (attr, { [c.CURRENT_PATH_NAME]: currentPaths } = {}, callerArgs, stock) => {
  const { store, path, type, jsonataDef } = attr
  const state = stock.reduxStore.getState()
  return getStateValue(state, { store, path, type, jsonataDef }, currentPaths as PathModifiersType)
}

const set: JsonUIFunctionType = (attr, props, callerArgs, stock) => {
  stock.reduxStore.dispatch(
    setAction({ ...attr, value: attr && attr.value !== undefined ? attr.value : callerArgs[0], [c.CURRENT_PATH_NAME]: props[c.CURRENT_PATH_NAME], stock })
  )
}

const jsonata: JsonUIFunctionType = ({ jsonataDef, ...attr }) => {
  if (jsonataDef) {
    // console.log(' ---- jsonata ---- ')
    // console.log('jsonataDef: ', jsonataDef)
    // console.log('attr: ', attr)
    try {
      const expression = jsonataObj(jsonataDef)
      const evaluate = expression.evaluate(attr)
      // console.log('evaluate: ', evaluate)
      return evaluate
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('jsonata error', error, jsonataDef)
    }
  }
  return null
}

// Async function examples
const httpGet: JsonUIFunctionType = async (attr, props, callerArgs, stock) => {
  const { url, headers = {}, timeout = 5000 } = attr

  if (!url) {
    throw new Error('URL is required for httpGet function')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

const httpPost: JsonUIFunctionType = async (attr, props, callerArgs, stock) => {
  const { url, data, headers = { 'Content-Type': 'application/json' }, timeout = 10000 } = attr

  if (!url) {
    throw new Error('URL is required for httpPost function')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const responseData = await response.json()
    return responseData
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

const delay: JsonUIFunctionType = async (attr) => {
  const { ms = 1000 } = attr
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const asyncValidate: JsonUIFunctionType = async (attr, props, callerArgs, stock) => {
  const { value, validationUrl, field } = attr

  if (!validationUrl || !value) {
    return { isValid: true }
  }

  try {
    const response = await fetch(validationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    })

    if (!response.ok) {
      return { isValid: false, error: 'Validation service unavailable' }
    }

    const result = await response.json()
    return result
  } catch (error) {
    return { isValid: false, error: 'Validation failed' }
  }
}

// Mark async functions for identification
httpGet.isAsync = true
httpPost.isAsync = true
delay.isAsync = true
asyncValidate.isAsync = true

export default {
  get,
  set,
  jsonata,
  httpGet,
  httpPost,
  delay,
  asyncValidate,
}
