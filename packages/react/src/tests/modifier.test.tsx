/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { matchers } from '@emotion/jest'
import { constants as c } from '@jsonui/core'
import { JsonUI } from '../index'

expect.extend(matchers)

const textModifierReturnFirst = (params: any) => {
  return JSON.stringify(params)
}

const textModifierReturnSecond = (_: any, compProps: any) => {
  return JSON.stringify(compProps)
}

test('simple modifier 1 input param', () => {
  render(
    <JsonUI
      functions={{ textModifierReturnFirst }}
      model={{ $comp: 'Text', $children: { $modifier: 'textModifierReturnFirst', a: 123, b: 12313, c: [1, 2, 3, 4] } }}
    />
  )

  const expectedText = JSON.stringify({ a: 123, b: 12313, c: [1, 2, 3, 4] })
  const textElement = screen.getByText(expectedText)
  expect(textElement).toBeInTheDocument()
})

test('simple modifier 2 input param', () => {
  const testModel = {
    $comp: 'Text',
    $children: { $modifier: 'textModifierReturnSecond', a: 123, b: 12313, c: [1, 2, 3, 4] },
    style: { marginTop: 3, padding: 5 },
  }
  render(<JsonUI functions={{ textModifierReturnSecond }} model={testModel} />)

  const expectedText = JSON.stringify({
    ...testModel,
    [`${c.CURRENT_PATH_NAME}`]: {},
  })
  const textElement = screen.getByText(expectedText)
  expect(textElement).toBeInTheDocument()
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
  render(<JsonUI functions={{ textModifierReturnSecond }} model={testModel} />)

  const expectedText = JSON.stringify({
    ...testModel,
    [`${c.CURRENT_PATH_NAME}`]: { data: { path: '/subscribed/list' } },
  })
  const textElement = screen.getByText(expectedText)
  expect(textElement).toBeInTheDocument()
})
