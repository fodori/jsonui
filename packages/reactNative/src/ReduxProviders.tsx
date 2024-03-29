import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, Store, AnyAction } from 'redux'
import { persistConfig, storeReducers } from '@jsonui/core'
import storage from '@react-native-async-storage/async-storage'
import { Persistor } from 'redux-persist/es/types'
import { persistStore, persistReducer } from 'redux-persist'

class Providers extends React.Component {
  store: Store<any, AnyAction>

  persistor: Persistor

  constructor(props: { children: ReactNode }) {
    super(props)
    const reducerConfig = { ...persistConfig, storage }
    const persistedReducer = persistReducer(reducerConfig, storeReducers)
    this.store = createStore(persistedReducer)
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
