import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, Store, AnyAction } from 'redux'
import { persistConfig, storeReducers } from '@jsonui/core'
import storage from 'redux-persist/lib/storage'
import { Persistor } from 'redux-persist/es/types'
import { persistStore, persistReducer } from 'redux-persist'

export interface DefaultValues {
  [key: string]: Record<string, object>
}

class Providers extends React.Component {
  store: Store<any, AnyAction>

  persistor: Persistor

  constructor(props: { children: ReactNode; defaultValues?: DefaultValues }) {
    super(props)
    const reducerConfig = { ...persistConfig, storage }
    const persistedReducer = persistReducer(reducerConfig, storeReducers)
    // eslint-disable-next-line no-underscore-dangle
    this.store = createStore(
      persistedReducer,
      { root: props.defaultValues }
      // (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
    // TODO the createstore hs a param about initial data if we need to
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
