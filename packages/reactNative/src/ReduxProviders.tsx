import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { createStore, Store, AnyAction } from 'redux'
import { storeReducers } from '@jsonui/core'

class Providers extends React.Component {
  store: Store<any, AnyAction>

  constructor(props: { children: ReactNode }) {
    super(props)
    this.store = createStore(storeReducers)
  }

  render() {
    const { children } = this.props
    return <Provider store={this.store}>{children}</Provider>
  }
}
export default Providers
