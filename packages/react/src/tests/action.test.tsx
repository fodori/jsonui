/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { matchers } from '@emotion/jest'
import { constants as c } from '@jsonui/core'
import { JsonUI } from '../index'

expect.extend(matchers)

test('simple action 1.(params) input param', async () => {
  const user = userEvent.setup()
  let returnVal: any = null

  const textModifierReturnFirst = (params: any) => {
    returnVal = JSON.stringify(params)
  }
  render(
    <JsonUI
      functions={{ textModifierReturnFirst }}
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        value: '8',
        onChange: { $action: 'textModifierReturnFirst', a: 123, b: 12313, c: [1, 2, 3, 4] },
      }}
    />
  )

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()
  await user.clear(input)
  await user.type(input, 'test@example.com')
  expect(returnVal).toEqual(JSON.stringify({ a: 123, b: 12313, c: [1, 2, 3, 4] }))
})

test('simple action 2.(compProps) input param', async () => {
  const user = userEvent.setup()
  let returnVal: any = null

  const textModifierReturnSecond = (_: any, compProps: any) => {
    returnVal = JSON.stringify(compProps)
  }

  render(
    <JsonUI
      functions={{ textModifierReturnSecond }}
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        value: '8',
        onChange: { $action: 'textModifierReturnSecond' },
      }}
    />
  )

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()
  await user.clear(input)
  await user.type(input, 'test@example.com')
  expect(returnVal).toEqual(
    JSON.stringify({
      $comp: 'Edit',
      id: 'id1',
      name: 'id1',
      value: '8',
      [`${c.CURRENT_PATH_NAME}`]: {},
      [`${c.REDUX_GET_SUBSCRIBERS_NAME}`]: [],
    })
  )
})

test('simple action 3.(actionParams) input param', () => {
  let returnVal: any = null

  const textModifierReturnThird = (_: any, __: any, actionParams: any) => {
    returnVal = actionParams
  }

  render(
    <JsonUI
      functions={{ textModifierReturnThird }}
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        value: '8',
        onChange: { $action: 'textModifierReturnThird' },
      }}
    />
  )

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()
  fireEvent.change(input, { target: { value: 'test@example.com' } })
  expect(returnVal).toEqual(['test@example.com'])
})

test('action value test', async () => {
  let returnVal: any = null

  const testAction = (_: any, __: any, actionParams: any) => {
    returnVal = actionParams
  }

  render(
    <JsonUI
      functions={{ testAction: testAction }}
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        value: '8',
        onChange: { $action: 'testAction' },
      }}
    />
  )

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()

  // Test string values (HTML inputs always deal with strings)
  fireEvent.change(input, { target: { value: 'true' } })
  expect(returnVal).toEqual(['true'])

  fireEvent.change(input, { target: { value: 'false' } })
  expect(returnVal).toEqual(['false'])

  fireEvent.change(input, { target: { value: '' } })
  expect(returnVal).toEqual([''])

  fireEvent.change(input, { target: { value: '6' } })
  expect(returnVal).toEqual(['6'])

  fireEvent.change(input, { target: { value: '-1' } })
  expect(returnVal).toEqual(['-1'])

  fireEvent.change(input, { target: { value: '0' } })
  expect(returnVal).toEqual(['0'])

  // TODO these test slways return as a string, check how it works really.
  fireEvent.change(input, { target: { value: true } })
  expect(returnVal).toEqual(['true'])

  fireEvent.change(input, { target: { value: false } })
  expect(returnVal).toEqual(['false'])

  fireEvent.change(input, { target: { value: null } })
  expect(returnVal).toEqual([''])

  fireEvent.change(input, { target: { value: undefined } })
  expect(returnVal).toEqual([''])
})
