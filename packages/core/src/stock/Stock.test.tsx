import Stock from './Stock'

test('Stock init test', () => {
  const testFunc = jest.fn((...attrib) => attrib)
  const testFunc1 = jest.fn(() => 66)
  const testFunc2 = jest.fn(() => 66)
  const newStock = { components: { NewComp: () => 5 }, functions: { testFunc, testFunc1 } }
  const stockInstance = new Stock(newStock, {} as React.ElementType, {})
  expect(stockInstance.stock).toStrictEqual(newStock)

  expect(stockInstance.stock.components.a1).toBeUndefined()
  const additional = { components: { a2: () => 8, a1: () => 1 }, functions: { testFunc3: () => 7 } }
  stockInstance.init(additional)
  expect(stockInstance.stock.components).toStrictEqual({ ...newStock.components, ...additional.components })
  expect(stockInstance.stock.functions).toStrictEqual({ ...newStock.functions, ...additional.functions })
  expect((stockInstance.stock.components.a1 as any)()).toStrictEqual(1)
  const a2 = () => 8
  stockInstance.registerComponent('a1', a2)
  expect((stockInstance.stock.components.a1 as any)()).not.toStrictEqual(8)

  stockInstance.registerFunction('testFunc1', testFunc2)
  expect(stockInstance.stock.functions.testFunc1).not.toBe(testFunc2)
  expect(stockInstance.stock.functions.testFunc1).toBe(testFunc1)
})

test('callFunctionSync test', () => {
  const testFunc = jest.fn((...attrib) => attrib)
  const testFunc1 = jest.fn(() => 66)
  const newStock = { components: {}, functions: { testFunc, testFunc1 } }
  const stockInstance = new Stock(newStock, {} as React.ElementType, {})
  const attr = 'attr'
  const callerArgs = 'callerArgs'
  stockInstance.callFunctionSync('testFunc', attr, callerArgs)
  expect(testFunc).toHaveBeenCalledTimes(1)
  expect(testFunc.mock.calls[0][0]).toBe('attr')
  expect(testFunc.mock.calls[0][1]).toBe('callerArgs')
  const res1 = stockInstance.callFunctionSync('testFunc1', attr, callerArgs)
  expect(res1).toBe(66)
  expect(testFunc).toHaveBeenCalledTimes(1)
  expect(testFunc.mock.calls[0][0]).toBe('attr')
  expect(testFunc.mock.calls[0][1]).toBe('callerArgs')
  const res2 = stockInstance.callFunctionSync('jkhlkjh', attr, callerArgs)
  expect(res2).toBe(null)
})

test('getComponent test', () => {
  const testFunc = jest.fn((...attrib) => attrib)
  const testFunc1 = jest.fn(() => 66)

  const a1 = () => 5
  const newStock = { components: { a1 }, functions: { testFunc, testFunc1 } }
  const stockInstance = new Stock(newStock, {} as React.ElementType, {})
  expect(stockInstance.getComponent('')).toBe(undefined)
  expect(stockInstance.getComponent('jhjhgjh')).toBe(undefined)
  expect(stockInstance.getComponent('a1')).toBe(a1)
})
