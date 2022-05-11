/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'

expect.extend(matchers)

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: any) => children,
}))

test('Edit component test', () => {
  const wrapper = mount(
    <JsonUI
      disabledPersist
      viewDef={{
        $comp: 'Edit',
        id: 'id1',
        name: 'id1',
        style: { textAlign: 'center', fontSize: 30, margin: 5 },
        value: { $modifier: 'get', store: 'data', path: '/age' },
        onChange: { $action: 'set', store: 'data', path: '/age' },
      }}
    />
  )

  expect(wrapper.find('input')).toHaveLength(1)
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
  expect(wrapper.find('input').at(0).prop('value')).toEqual('test@example.com')
})
/**
 * TODO:
 * - check rerenderer each data manipulation need 1 render
 * - check actions (with param, with input param from event, with nested .... )
 * - check modification  (with param, with input param from event, with nested .... )
 * - check modification order for example redux vs. simple function
 * - check asycn and sync functions as well
 * - check children and no children component with children prop
 * - check performance or memory leak???
 * - check data manipulation with mutability situation
 * - check error boundary how works
 * - check persistent data how works after reload
 * - test with app id and multiple instance how the persistent can work

 * */
