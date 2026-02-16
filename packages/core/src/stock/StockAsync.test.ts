import Stock from './Stock'

// Mock async functions for testing
const mockAsyncFunction = async (attr: any) => {
  await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate async delay
  return { result: 'async success', input: attr }
}

const mockSyncFunction = (attr: any) => {
  return { result: 'sync success', input: attr }
}

const mockErrorFunction = async (attr: any) => {
  await new Promise((resolve) => setTimeout(resolve, 50))
  throw new Error('Async error occurred')
}

// Mark async functions
mockAsyncFunction.isAsync = true
mockErrorFunction.isAsync = true

describe('Stock Async Functions', () => {
  let stock: Stock

  beforeEach(() => {
    const components = { TestComp: () => 'test' }
    const functions = {
      mockAsyncFunction,
      mockSyncFunction,
      mockErrorFunction,
    }
    stock = new Stock({ components, functions }, {} as React.ElementType, {})
  })

  test('callFunction should work with sync functions', () => {
    const result = stock.callFunction('mockSyncFunction', { test: 'data' })
    expect(result).toEqual({ result: 'sync success', input: { test: 'data' } })
  })

  test('callFunctionAsync should handle async functions', async () => {
    const result = await stock.callFunctionAsync('mockAsyncFunction', { test: 'data' })
    expect(result).toEqual({ result: 'async success', input: { test: 'data' } })
  })

  test('callFunctionAsync should handle sync functions', async () => {
    const result = await stock.callFunctionAsync('mockSyncFunction', { test: 'data' })
    expect(result).toEqual({ result: 'sync success', input: { test: 'data' } })
  })

  test('callFunctionAsync should handle async function errors', async () => {
    await expect(stock.callFunctionAsync('mockErrorFunction', { test: 'data' })).rejects.toThrow('Async error occurred')
  })

  test('isAsyncFunction should correctly identify async functions', () => {
    expect(stock.isAsyncFunction('mockAsyncFunction')).toBe(true)
    expect(stock.isAsyncFunction('mockSyncFunction')).toBe(false)
    expect(stock.isAsyncFunction('mockErrorFunction')).toBe(true)
    expect(stock.isAsyncFunction('nonexistentFunction')).toBe(false)
  })

  test('callFunction should return null for non-existent functions', () => {
    const result = stock.callFunction('nonexistentFunction', { test: 'data' })
    expect(result).toBe(null)
  })

  test('callFunctionAsync should return null for non-existent functions', async () => {
    const result = await stock.callFunctionAsync('nonexistentFunction', { test: 'data' })
    expect(result).toBe(null)
  })
})
