import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, Store, AnyAction } from 'redux'
import { persistConfig, storeReducers } from '@jsonui/core'
import storage from 'redux-persist/lib/storage'
import { Persistor } from 'redux-persist/es/types'
import { persistStore, persistReducer } from 'redux-persist'

class Providers extends React.Component {
  store: Store<any, AnyAction>

  persistor: Persistor

  constructor(props: { children: ReactNode }) {
    super(props)
    const reducerConfig = { ...persistConfig, storage }
    const persistedReducer = persistReducer(reducerConfig, storeReducers)
    // eslint-disable-next-line no-underscore-dangle
    this.store = createStore(persistedReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__())
    this.persistor = persistStore(this.store)
  }

  render() {
    const { children } = this.props
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor}>
          {children}
        </PersistGate>
      </Provider>
    )
  }
}
export default Providers
