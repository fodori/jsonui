/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { constants as c } from '@jsonui/core'
import { JsonUI } from '../index'
import Text from '../stock/components/Text'

expect.extend(matchers)

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
  const wrapper = mount(<JsonUI functions={{ textModifierReturnSecond }} model={testModel} />)

  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.text()).toEqual(
    JSON.stringify({
      ...testModel,
      [`${c.CURRENT_PATH_NAME}`]: {
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
