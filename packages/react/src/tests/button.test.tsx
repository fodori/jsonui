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

test('Text component test', () => {
  const wrapper = mount(
    <JsonUI
      disabledPersist
      model={[
        { $comp: 'Text', $children: { $modifier: 'get', store: 'data', path: '/age' } },
        {
          $comp: 'Button',
          onClick: { $action: 'set', store: 'data', path: '/age', value: 'button test' },
        },
      ]}
    />
  )

  expect(wrapper.find('button')).toHaveLength(1)
  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.find(Text).at(0).children().contains('button test')).toEqual(false)
  wrapper.find('button').at(0).simulate('click')
  expect(wrapper.find(Text).at(0).children().contains('button test')).toEqual(true)
})
