/* eslint-disable */
import { MODIFIER_KEY, REDUX_GET_FUNCTION } from '../utils/constants'
import { calculatePropsFromModifier,pathModifierBuilder } from './wrapperUtil'
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

test('test getGetsPath with nested json', () => {
  

  const props=(path:string)=>({
    currentPaths:{
      data1: { path },
    }
  })

  const modifier=(path:string)=>({
      data1: { path },
  })

  expect(pathModifierBuilder(props('/subscribed'),modifier('list'))?.currentPaths?.data1?.path).toEqual('/subscribed/list')
  expect(pathModifierBuilder(props('/subscribed'),modifier('/list'))?.currentPaths?.data1?.path).toEqual('/list')
  expect(pathModifierBuilder(props('/subscribed'),modifier('../list'))?.currentPaths?.data1?.path).toEqual('/list')
  expect(pathModifierBuilder(props('/sub/scr/ib/ed'),modifier('../list'))?.currentPaths?.data1?.path).toEqual('/sub/scr/ib/list')
  expect(pathModifierBuilder(props('/sub/scr/ib/ed'),modifier('../../list'))?.currentPaths?.data1?.path).toEqual('/sub/scr/list')
  expect(pathModifierBuilder(props('/sub/scr/ib/ed'),modifier('./list'))?.currentPaths?.data1?.path).toEqual('/sub/scr/ib/ed/list')
  expect(pathModifierBuilder(props('/sub/scr/ib/ed'),modifier('list'))?.currentPaths?.data1?.path).toEqual('/sub/scr/ib/ed/list')


  expect(pathModifierBuilder(props('/'),modifier('list'))?.currentPaths?.data1?.path).toEqual('/list')
  expect(pathModifierBuilder(props('/'),modifier('/list'))?.currentPaths?.data1?.path).toEqual('/list')
  expect(pathModifierBuilder(props('/0'),modifier('list'))?.currentPaths?.data1?.path).toEqual('/0/list')
  expect(pathModifierBuilder(props('/0'),modifier('list'))?.currentPaths?.data1?.path).toEqual('/0/list')
})
