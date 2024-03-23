import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, Store, AnyAction } from 'redux'
import { persistConfig, storeReducers } from '@jsonui/core'
import storage from 'redux-persist/lib/storage'
import { Persistor } from 'redux-persist/es/types'
import { persistStore, persistReducer } from 'redux-persist'
import { DefaultValues } from 'types'

type MyProps = { children: ReactNode; defaultValues?: DefaultValues; disabledPersist?: boolean }

class Providers extends React.Component<MyProps> {
  store: Store<any, AnyAction>

  persistor: Persistor

  disabledPersist: boolean

  constructor(props: MyProps) {
    super(props)
    const reducerConfig = { ...persistConfig, storage }
    this.disabledPersist = props.disabledPersist || false
    const persistedReducer = this.disabledPersist ? storeReducers : persistReducer(reducerConfig, storeReducers)
    this.store = createStore(
      persistedReducer,
      { root: props.defaultValues },
      // eslint-disable-next-line no-underscore-dangle
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    )
    this.persistor = persistStore(this.store)
  }

  render() {
    const { children } = this.props
    return (
      <Provider store={this.store}>
        {this.disabledPersist ? (
          children
        ) : (
          <PersistGate loading={null} persistor={this.persistor}>
            {children}
          </PersistGate>
        )}
      </Provider>
    )
  }
}
export default Providers
