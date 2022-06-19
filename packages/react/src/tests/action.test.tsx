/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'

expect.extend(matchers)

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: any) => children,
}))

test('simple action 1.(params) input param', () => {
  let returnVal: any = null

  const textModifierReturnFirst = (params: any) => {
    returnVal = JSON.stringify(params)
  }
  const wrapper = mount(
    <JsonUI
      disabledPersist
      functions={{ textModifierReturnFirst }}
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        style: { textAlign: 'center', fontSize: 30, margin: 5 },
        value: '8',
        onChange: { $action: 'textModifierReturnFirst', a: 123, b: 12313, c: [1, 2, 3, 4] },
      }}
    />
  )

  expect(wrapper.find('input')).toHaveLength(1)
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
  expect(returnVal).toEqual(JSON.stringify({ a: 123, b: 12313, c: [1, 2, 3, 4] }))
})

test('simple action 2.(compProps) input param', () => {
  let returnVal: any = null

  const textModifierReturnSecond = (_: any, compProps: any) => {
    returnVal = JSON.stringify(compProps)
  }

  const wrapper = mount(
    <JsonUI
      disabledPersist
      functions={{ textModifierReturnSecond }}
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        style: { textAlign: 'center', fontSize: 30, margin: 5 },
        value: '8',
        onChange: { $action: 'textModifierReturnSecond' },
      }}
    />
  )

  expect(wrapper.find('input')).toHaveLength(1)
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
  expect(returnVal).toEqual(
    JSON.stringify({ $comp: 'Edit', id: 'id1', name: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 }, value: '8', currentPaths: {} })
  )
})

test('simple action 3.(actionParams) input param', () => {
  let returnVal: any = null

  const textModifierReturnThird = (_: any, __: any, actionParams: any) => {
    returnVal = actionParams
  }

  const wrapper = mount(
    <JsonUI
      disabledPersist
      functions={{ textModifierReturnThird }}
      model={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        style: { textAlign: 'center', fontSize: 30, margin: 5 },
        value: '8',
        onChange: { $action: 'textModifierReturnThird' },
      }}
    />
  )

  expect(wrapper.find('input')).toHaveLength(1)
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
  expect(returnVal).toEqual(['test@example.com'])
})
