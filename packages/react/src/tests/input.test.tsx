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
