/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { storeReducers } from '@jsonui/core'
import Renderer from './Renderer'
import viewDef from './Example.json'
import stockInit from './stock/stockToRenderer'

Enzyme.configure({ adapter: new Adapter() })

const store = createStore(storeReducers)

test('shallow test', () => {
  const jsonUI = shallow(
    <Provider store={store}>
      <Renderer viewDef={viewDef} stockInit={stockInit} />
    </Provider>
  )

  expect(jsonUI.text()).toEqual('<rendererFunc />')
})

test('moun test', () => {
  const wrapper = mount(
    <Provider store={store}>
      <Renderer viewDef={viewDef} stockInit={stockInit} />
    </Provider>
  )

  expect(wrapper.text()).toEqual('JsonUI test page v0.1onea2a3a4a5a6a7a8a9a10a11a12a13a14')
  //expect(wrapper.debug()).toEqual('')
})
export {}
