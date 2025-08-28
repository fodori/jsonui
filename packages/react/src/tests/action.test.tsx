/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { constants as c } from '@jsonui/core'
import { JsonUI } from '../index'

expect.extend(matchers)

test('simple action 1.(params) input param', () => {
  let returnVal: any = null

  const textModifierReturnFirst = (params: any) => {
    returnVal = JSON.stringify(params)
  }
  const wrapper = mount(
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

  expect(wrapper.find('input')).toHaveLength(1)
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
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

  const wrapper = mount(
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

  expect(wrapper.find('input')).toHaveLength(1)
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
  expect(returnVal).toEqual(['test@example.com'])
})

test('action value test', () => {
  let returnVal: any = null

  const testAction = (_: any, __: any, actionParams: any) => {
    returnVal = actionParams
  }

  const wrapper = mount(
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

  expect(wrapper.find('input')).toHaveLength(1)
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: true } })
  expect(returnVal).toEqual([true])
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: false } })
  expect(returnVal).toEqual([false])
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: null } })
  expect(returnVal).toEqual([null])
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: undefined } })
  expect(returnVal).toEqual([undefined])
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 6 } })
  expect(returnVal).toEqual([6])
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: -1 } })
  expect(returnVal).toEqual([-1])
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 0 } })
  expect(returnVal).toEqual([0])
})
