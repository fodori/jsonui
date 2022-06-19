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

const textModifierReturnFirst = (params: any) => {
  return JSON.stringify(params)
}

const textModifierReturnSecond = (_: any, compProps: any) => {
  return JSON.stringify(compProps)
}

test('simple modifier 1 input param', () => {
  const wrapper = mount(
    <JsonUI
      disabledPersist
      functions={{ textModifierReturnFirst }}
      model={{ $comp: 'Text', $children: { $modifier: 'textModifierReturnFirst', a: 123, b: 12313, c: [1, 2, 3, 4] } }}
    />
  )

  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.find(Text).at(0).children().text()).toEqual(JSON.stringify({ a: 123, b: 12313, c: [1, 2, 3, 4] }))
})

test('simple modifier 2 input param', () => {
  const testModel = {
    $comp: 'Text',
    $children: { $modifier: 'textModifierReturnSecond', a: 123, b: 12313, c: [1, 2, 3, 4] },
    style: { marginTop: 3, padding: 5 },
  }
  const wrapper = mount(<JsonUI disabledPersist functions={{ textModifierReturnSecond }} model={testModel} />)

  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.find(Text).at(0).children().text()).toEqual(
    JSON.stringify({
      ...testModel,
      currentPaths: {},
    })
  )
})

test('simple modifier 2 input param with pathmodifier', () => {
  const testModel = {
    $comp: 'Text',
    $children: { $modifier: 'textModifierReturnSecond', a: 123, b: 12313, c: [1, 2, 3, 4] },
    style: { marginTop: 3, padding: 5 },
    $pathModifiers: {
      data: { path: '/subscribed/list' },
    },
  }
  const wrapper = mount(<JsonUI disabledPersist functions={{ textModifierReturnSecond }} model={testModel} />)

  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.find(Text).at(0).children().text()).toEqual(
    JSON.stringify({
      ...testModel,
      currentPaths: { data: { path: '/subscribed/list' } },
    })
  )
})
