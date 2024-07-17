import Stock from './Stock'

test('Stock init test', () => {
  const testFunc = jest.fn((...attrib) => attrib)
  const testFunc1 = jest.fn(() => 66)
  const newStock = { components: { a1: 5 }, functions: { testFunc, testFunc1 } }
  const stockInstance = new Stock(newStock, {} as React.ElementType, {})
  expect(stockInstance.stock).toStrictEqual(newStock)
  const additional = { components: { a2: 8, a1: 8 }, functions: { testFunc3: () => 7 } }
  expect(stockInstance.stock.components.a1).toStrictEqual(5)
  stockInstance.init(additional)
  expect(stockInstance.stock.components).toStrictEqual({ ...newStock.components, ...additional.components })
  expect(stockInstance.stock.functions).toStrictEqual({ ...newStock.functions, ...additional.functions })
  expect(stockInstance.stock.components.a1).toStrictEqual(8)
  const a1 = 9
  stockInstance.registerComponent('a1', a1)
  expect(stockInstance.stock.components.a1).toStrictEqual(8)
  const a2 = () => 7
  stockInstance.registerFunction('testFunc1', a2)
  expect(stockInstance.stock.functions.testFunc1).not.toBe(a2)
  expect(stockInstance.stock.functions.testFunc1).toBe(testFunc1)
})

test('callFunction test', () => {
  const testFunc = jest.fn((...attrib) => attrib)
  const testFunc1 = jest.fn(() => 66)
  const newStock = { components: {}, functions: { testFunc, testFunc1 } }
  const stockInstance = new Stock(newStock, {} as React.ElementType, {})
  const attr = 'attr'
  const callerArgs = 'callerArgs'
  stockInstance.callFunction('testFunc', attr, callerArgs)
  expect(testFunc).toHaveBeenCalledTimes(1)
  expect(testFunc.mock.calls[0][0]).toBe('attr')
  expect(testFunc.mock.calls[0][1]).toBe('callerArgs')
  const res1 = stockInstance.callFunction('testFunc1', attr, callerArgs)
  expect(res1).toBe(66)
  expect(testFunc).toHaveBeenCalledTimes(1)
  expect(testFunc.mock.calls[0][0]).toBe('attr')
  expect(testFunc.mock.calls[0][1]).toBe('callerArgs')
  const res2 = stockInstance.callFunction('jkhlkjh', attr, callerArgs)
  expect(res2).toBe(null)
})

test('getComponent test', () => {
  const testFunc = jest.fn((...attrib) => attrib)
  const testFunc1 = jest.fn(() => 66)
  const newStock = { components: { a1: 5 }, functions: { testFunc, testFunc1 } }
  const stockInstance = new Stock(newStock, {} as React.ElementType, {})
  expect(stockInstance.getComponent('')).toBe(undefined)
  expect(stockInstance.getComponent('jhjhgjh')).toBe(undefined)
  expect(stockInstance.getComponent('a1')).toBe(5)
})
