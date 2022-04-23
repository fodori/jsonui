/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'
import PrimitiveProp from '../stock/components/PrimitiveProp'

expect.extend(matchers)

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
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
})

test('string test', () => {
  const wrapper = mount(<JsonUI viewDef="JsonUI test page v0.1" />)
  expect(wrapper.contains('JsonUI test page v0.1')).toEqual(true)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
})

test('integer test', () => {
  const wrapper = mount(<JsonUI viewDef={999888} />)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
  expect(wrapper.contains(999888)).toEqual(true)
})

test('integer 0 test', () => {
  const wrapper = mount(<JsonUI viewDef={0} />)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
  expect(wrapper.text()).toEqual('0')
  expect(wrapper.find(PrimitiveProp).at(0).children().text()).toEqual('0')
})

test('negative integer test', () => {
  const wrapper = mount(<JsonUI viewDef={-999888} />)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
  expect(wrapper.contains(-999888)).toEqual(true)
})

test('complex number test', () => {
  const wrapper = mount(<JsonUI viewDef={2.99792458e8} />)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
  expect(wrapper.contains(2.99792458e8)).toEqual(true)
})

test('boolean test true', () => {
  const wrapper = mount(<JsonUI viewDef />)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
  expect(wrapper.find(PrimitiveProp).at(0).children().contains('true')).toEqual(true)
})

test('boolean test false', () => {
  const wrapper = mount(<JsonUI viewDef={false} />)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(1)
  expect(wrapper.find(PrimitiveProp).at(0).children().contains('false')).toEqual(true)
})

test('array test', () => {
  const wrapper = mount(<JsonUI viewDef={[1, null, true, false, -3, 'qqqqq']} />)
  expect(wrapper.find(PrimitiveProp)).toHaveLength(6)
  expect(wrapper.find(PrimitiveProp).at(0).children().text()).toEqual('1')
  expect(wrapper.find(PrimitiveProp).at(1).children().text()).toEqual('null')
  expect(wrapper.find(PrimitiveProp).at(2).children().text()).toEqual('true')
  expect(wrapper.find(PrimitiveProp).at(3).children().text()).toEqual('false')
  expect(wrapper.find(PrimitiveProp).at(4).children().text()).toEqual('-3')
  expect(wrapper.find(PrimitiveProp).at(5).children().text()).toEqual('qqqqq')
})
