/* eslint-disable */
import { MODIFIER_KEY, REDUX_GET_FUNCTION } from '../utils/constants'
import { calculatePropsFromModifier } from './wrapperUtil'
import Stock from '../stock/Stock'


const json1 = {
  $comp: 'Fragment',
  $children: [
    {
      $comp: 'Edit',
      value: { $modifier: 'get', store: 'data', path: 'age' },
      label: 'Field level validation',
      helperText: "it's a child age",
      onChange: { $action: 'set', store: 'data', path: 'age', jsonataDef: '$' },
    },
    {
      $comp: 'Text',
      $children: { $modifier: 'get', store: 'data', path: 'age' },
    },
    {
      $comp: 'Text',
      $children: { $modifier: 'get', store: 'data', path: { $modifier: 'MyFunction' } },
    },
    { $modifier: 'get', store: 'data', path: { $modifier: 'MyFunction' } }
  ],
  style:{ color:{ $modifier: 'get', store: 'data', path: { $modifier: 'MyFunction' } }},
  id: { $modifier: 'get' }
}
test('test getGetsPath with nested json', () => {
  const testFunc = jest.fn((...attrib) => attrib)
  const testFunc1 = jest.fn(() => 66)
  const newStock = { components: { a1: 5 }, functions: { testFunc, testFunc1 } }
  const result = calculatePropsFromModifier(json1,new Stock(newStock, {}, {}))

  expect(result).not.toEqual(null)
})
