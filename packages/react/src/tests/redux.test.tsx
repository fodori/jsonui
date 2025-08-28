/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef } from 'react'
import { mount } from 'enzyme'
import { matchers } from '@emotion/jest'
import { JsonUI } from '../index'
import components from '../stock/components'
import jsonpointer from 'jsonpointer'

expect.extend(matchers)

const Counter = (props: any) => {
  return <h1>props: {JSON.stringify(props)}</h1>
}

const NewEdit = (props: any) => {
  const OldEdit = components.Edit
  return (
    <>
      <OldEdit {...props} />
      <Counter value={props.value} />
    </>
  )
}

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
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {}')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 'test@example.com' } })
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {"value":"test@example.com"}')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: true } })
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {"value":true}')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: 1 } })
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {"value":1}')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: null } })
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {"value":null}')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: false } })
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {"value":false}')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: '' } })
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {"value":""}')
  wrapper
    .find('input')
    .at(0)
    .simulate('change', { target: { value: undefined } })
  expect(wrapper.find(Counter).at(0).children().text()).toEqual('props: {}')
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
