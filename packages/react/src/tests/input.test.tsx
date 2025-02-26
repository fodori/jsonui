/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef } from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'
import components from '../stock/components'

expect.extend(matchers)

const Counter = () => {
  const renderCounter = useRef(0)
  renderCounter.current += 1
  return <h1>Renders: {renderCounter.current}</h1>
}

const NewEdit = (props: any) => {
  const OldEdit = components.Edit
  return (
    <>
      <OldEdit {...props} />
      <Counter />
    </>
  )
}

test('Edit component test', () => {
  const wrapper = mount(
    <JsonUI
      model={{
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

test('check rerender count after action', () => {
  const wrapper = mount(
    <JsonUI
      components={{ Counter, NewEdit }}
      model={{
        $comp: 'NewEdit',
        id: 'id1',
        name: 'id1',
        style: { textAlign: 'center', fontSize: 30, margin: 5 },
        value: { $modifier: 'get', store: 'data', path: '/age' },
        onChange: { $action: 'set', store: 'data', path: '/age' },
      }}
    />
  )

  expect(wrapper.find('input')).toHaveLength(1)
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('Renders: 1')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
  expect(wrapper.find('input').at(0).prop('value')).toEqual('test@example.com')
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('Renders: 2')
})
/**
 * TODO:
 * - check actions (with nested ,promise and sync )
 * - check modification (with nested ,promise and sync )
 * - check modification order for example redux vs. simple function
 * - check children and no children component with children prop
 * - check data manipulation with mutability situation
 * - check error boundary how works
 * Low:
 * - check performance or memory leak???

 * */
