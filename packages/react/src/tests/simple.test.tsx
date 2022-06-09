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

test('model undefined', () => {
  const wrapper = mount(<JsonUI model={undefined} />)
  expect(wrapper).toEqual({})
})

test('model null', () => {
  const wrapper = mount(<JsonUI model={null} />)
  expect(wrapper).toEqual({})
})

test('Text component test', () => {
  const wrapper = mount(
    <JsonUI model={{ $comp: 'Text', $children: 'JsonUI test page v0.1', id: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 } }} />
  )

  expect(wrapper.find(Text)).toHaveLength(1)
  expect(wrapper.contains('JsonUI test page v0.1')).toEqual(true)
  expect(wrapper.find(Text).props().id).toEqual('id1')
  expect(wrapper.find(Text).children().contains('JsonUI test page v0.1')).toEqual(true)
})

test('model view and 2 text with style', () => {
  const wrapper = mount(
    <JsonUI
      model={{
        $comp: 'View',
        $children: [
          { $comp: 'Text', $children: 'test111', id: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 } },
          { $comp: 'Text', $children: 'test2222', id: 'id2', style: { textAlign: 'left', fontSize: 37, margin: 5 } },
        ],
      }}
    />
  )

  expect(wrapper.find(Text)).toHaveLength(2)
  expect(wrapper.contains('test111')).toEqual(true)
  expect(wrapper.contains('test2222')).toEqual(true)
  expect(wrapper.find(Text).get(0).props.id).toEqual('id1')
  expect(wrapper.find(Text).get(0)).toHaveStyleRule('text-align', 'center')
  expect(wrapper.find(Text).get(0)).toHaveStyleRule('font-size', '30px')
  expect(wrapper.find(Text).at(0).children().contains('test111')).toEqual(true)
  expect(wrapper.find(Text).get(1).props.id).toEqual('id2')
  expect(wrapper.find(Text).get(1)).toHaveStyleRule('text-align', 'left')
  expect(wrapper.find(Text).get(1)).toHaveStyleRule('font-size', '37px')
  expect(wrapper.find(Text).at(1).children().contains('test2222')).toEqual(true)
})

test('simple array test with htext', () => {
  const wrapper = mount(
    <JsonUI
      model={[
        { $comp: 'Text', $children: 'test111', id: 'id1', style: { textAlign: 'center', fontSize: 30, margin: 5 } },
        { $comp: 'Text', $children: 'test2222', id: 'id2', style: { textAlign: 'left', fontSize: 37, margin: 5 } },
      ]}
    />
  )

  expect(wrapper.find(Text)).toHaveLength(2)
  expect(wrapper.contains('test111')).toEqual(true)
  expect(wrapper.contains('test2222')).toEqual(true)
  expect(wrapper.find(Text).get(0).props.id).toEqual('id1')
  expect(wrapper.find(Text).get(0)).toHaveStyleRule('text-align', 'center')
  expect(wrapper.find(Text).get(0)).toHaveStyleRule('font-size', '30px')
  expect(wrapper.find(Text).at(0).children().contains('test111')).toEqual(true)
  expect(wrapper.find(Text).get(1).props.id).toEqual('id2')
  expect(wrapper.find(Text).get(1)).toHaveStyleRule('text-align', 'left')
  expect(wrapper.find(Text).get(1)).toHaveStyleRule('font-size', '37px')
  expect(wrapper.find(Text).at(1).children().contains('test2222')).toEqual(true)
})
