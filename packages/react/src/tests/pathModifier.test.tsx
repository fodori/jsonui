/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'
import Text from '../stock/components/Text'

expect.extend(matchers)

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: any) => children,
}))

const textModifierReturnSecond = (_: any, compProps: any) => {
  return JSON.stringify(compProps)
}

test('simple modifier 2. input param with pathmodifier', () => {
  const testModel = {
    $comp: 'Text',
    $children: { $modifier: 'textModifierReturnSecond', a: 123, b: 12313, c: [1, 2, 3, 4] },
    style: { marginTop: 3, padding: 5 },
    $pathModifiers: {
      data1: { path: '/subscribed/list' },
      data2: { path: 'list' },
      data3: { path: '/list' },
      data4: { path: '/subscribed/list' },
      data5: { path: '../list' },
      data6: { path: '../list/prop0' },
    },
  }
  const wrapper = mount(<JsonUI disabledPersist functions={{ textModifierReturnSecond }} model={testModel} />)

  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.find(Text).at(0).children().text()).toEqual(
    JSON.stringify({
      ...testModel,
      currentPaths: {
        data1: { path: '/subscribed/list' },
        data2: { path: '/list' },
        data3: { path: '/list' },
        data4: { path: '/subscribed/list' },
        data5: { path: '/../list' },
        data6: { path: '/../list/prop0' },
      },
    })
  )
})
const testModelFn = (firstLevel: string, secondLevel: string) => ({
  $comp: 'Fragment',
  $pathModifiers: {
    data1: { path: firstLevel },
  },
  $children: {
    $comp: 'Text',
    $children: { $modifier: 'textModifierReturnSecond', a: 123, b: 12313, c: [1, 2, 3, 4] },
    style: { marginTop: 3, padding: 5 },
    $pathModifiers: {
      data1: { path: secondLevel },
    },
  },
})

const testBlock = (testModel: any, expectedPath: string) => {
  const wrapper = mount(<JsonUI disabledPersist functions={{ textModifierReturnSecond }} model={testModel} />)
  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.find(Text).at(0).children().text()).toEqual(
    JSON.stringify({
      ...testModel.$children,
      parentComp: { $comp: 'Fragment', $pathModifiers: { data1: { path: testModel.$pathModifiers.data1.path } } },
      currentPaths: {
        data1: { path: expectedPath },
      },
    })
  )
}

test('simple modifier 2. input param with pathmodifier 2 level 1.', () => {
  testBlock(testModelFn('/subscribed', 'list'), '/subscribed/list')
})

test('simple modifier 2. input param with pathmodifier 2 level 2.', () => {
  testBlock(testModelFn('/subscribed', '/list'), '/list')
})

test('simple modifier 2. input param with pathmodifier 2 level 3.', () => {
  testBlock(testModelFn('/subscribed', '../list'), '/list')
})

test('simple modifier 2. input param with pathmodifier 2 level 4.', () => {
  testBlock(testModelFn('/sub/scr/ib/ed', '../list'), '/sub/scr/ib/list')
})

test('simple modifier 2. input param with pathmodifier 2 level 4.', () => {
  testBlock(testModelFn('/sub/scr/ib/ed', '../../list'), '/sub/scr/list')
})

test('simple modifier 2. input param with pathmodifier 2 level 5.', () => {
  testBlock(testModelFn('/sub/scr/ib/ed', './list'), '/sub/scr/ib/ed/list')
})

test('simple modifier 2. input param with pathmodifier 2 level 6.', () => {
  testBlock(testModelFn('/sub/scr/ib/ed', 'list'), '/sub/scr/ib/ed/list')
})
