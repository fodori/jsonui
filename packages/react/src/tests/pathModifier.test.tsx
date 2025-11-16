/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { matchers } from '@emotion/jest'
import { constants as c } from '@jsonui/core'
import { JsonUI } from '../index'

expect.extend(matchers)

const textModifierReturnSecond = (_: any, compProps: any) => {
  return JSON.stringify(compProps)
}

test('simple modifier 2. input param with pathmodifier', () => {
  const testModel = {
    $comp: 'Text',
    $children: { $modifier: 'textModifierReturnSecond' },
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
  render(<JsonUI functions={{ textModifierReturnSecond }} model={testModel} />)

  const expectedText = JSON.stringify({
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

  const textElement = screen.getByText(expectedText)
  expect(textElement).toBeInTheDocument()
})
