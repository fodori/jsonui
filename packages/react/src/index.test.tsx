/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { shallow } from 'enzyme'
import { JsonUI } from './index'
import viewDef from './Example.json'

test('isNumber test', () => {
  const jsonUI = shallow(<JsonUI viewDef={viewDef} />)

  expect(jsonUI.text()).toEqual('Off')
})
