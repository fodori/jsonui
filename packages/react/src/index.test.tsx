/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { mount } from 'enzyme'
import { JsonUI } from './index'
import Text from './stock/components/Text'

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }: any) => children,
}))

test('viewDef undefined', () => {
  const wrapper = mount(<JsonUI viewDef={undefined} />)
  expect(wrapper).toEqual({})
})

test('viewDef null', () => {
  const wrapper = mount(<JsonUI viewDef={null} />)
  expect(wrapper).toEqual({})
})

test('viewDef undefined', () => {
  const wrapper = mount(
    <JsonUI viewDef={{ $comp: 'Text', $children: 'JsonUI test page v0.1', id: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 } }} />
  )

  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.contains('JsonUI test page v0.1')).toEqual(true)
  expect(wrapper.find(Text).props().id).toEqual('id1')
  expect(wrapper.find(Text).children().contains('JsonUI test page v0.1')).toEqual(true)
})
