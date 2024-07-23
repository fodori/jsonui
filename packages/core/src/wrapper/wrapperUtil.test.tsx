/* eslint-disable */
import { calculatePropsFromModifier,getParentProps,getCurrentPaths } from './wrapperUtil'
import Stock from '../stock/Stock'
import { PropsType } from 'utils/types'
import * as c from '../utils/constants'


const json1 = {
  $comp: 'Fragment',
  $children: [
    {
      $comp: 'Edit',
      value: { $modifier: 'get', store: 'data', path: 'age' },
      label: 'Validation',
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
  const result = calculatePropsFromModifier(json1,new Stock(newStock, {} as React.ElementType, {}))

  expect(result).not.toEqual(null)
})

test('test getGetsPath with nested json', () => {
  

  const props=(path:string)=>({
    [c.CURRENT_PATH_NAME]:{
      data1: { path },
    }
  })

  const modifier=(path:string)=>({
      data1: { path },
  })

  expect(getCurrentPaths(props('/subscribed'),modifier('list'))?.data1?.path).toEqual('/subscribed/list')
  expect(getCurrentPaths(props('/subscribed'),modifier('/list'))?.data1?.path).toEqual('/list')
  expect(getCurrentPaths(props('/subscribed'),modifier('../list'))?.data1?.path).toEqual('/list')
  expect(getCurrentPaths(props('/sub/scr/ib/ed'),modifier('../list'))?.data1?.path).toEqual('/sub/scr/ib/list')
  expect(getCurrentPaths(props('/sub/scr/ib/ed'),modifier('../../list'))?.data1?.path).toEqual('/sub/scr/list')
  expect(getCurrentPaths(props('/sub/scr/ib/ed'),modifier('./list'))?.data1?.path).toEqual('/sub/scr/ib/ed/list')
  expect(getCurrentPaths(props('/sub/scr/ib/ed'),modifier('list'))?.data1?.path).toEqual('/sub/scr/ib/ed/list')


  expect(getCurrentPaths(props('/'),modifier('list'))?.data1?.path).toEqual('/list')
  expect(getCurrentPaths(props('/'),modifier('/list'))?.data1?.path).toEqual('/list')
  expect(getCurrentPaths(props('/0'),modifier('list'))?.data1?.path).toEqual('/0/list')
  expect(getCurrentPaths(props('/0'),modifier('list'))?.data1?.path).toEqual('/0/list')
})

test('test getParentProps', () => {
  
  expect(getParentProps(null as unknown as PropsType)).toStrictEqual({})
  expect(getParentProps(undefined as unknown as PropsType)).toStrictEqual({})
  expect(getParentProps(234 as unknown as PropsType)).toStrictEqual({})
  expect(getParentProps("234" as unknown as PropsType)).toStrictEqual({})
  expect(getParentProps([] as unknown as PropsType)).toStrictEqual({})
  expect(getParentProps([5,87,4556] as unknown as PropsType)).toStrictEqual({})
  expect(getParentProps(["asas","bbb"] as unknown as PropsType)).toStrictEqual({})
  expect(getParentProps({a:'aa'} as unknown as PropsType)).toStrictEqual({a:'aa'})
  expect(getParentProps({a:'aa','$child':'test'} as unknown as PropsType)).toStrictEqual({a:'aa'})
  expect(getParentProps({a:'aa','$children':'test'} as unknown as PropsType)).toStrictEqual({a:'aa'})
  expect(getParentProps({a:'aa','$childMain':'test'} as unknown as PropsType)).toStrictEqual({a:'aa'})
  expect(getParentProps({a:'aa','$childMain':'test','$childTop':'test','$child':'test','$children':'test'} as unknown as PropsType)).toStrictEqual({a:'aa'})
  expect(getParentProps({a:'aa',ab:'aa','$childMain':'test'} as unknown as PropsType)).toStrictEqual({a:'aa',ab:'aa'})
})
