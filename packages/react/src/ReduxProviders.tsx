import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createStore, Store, AnyAction } from 'redux'
import { persistConfig, storeReducers } from '@jsonui/core'
import storage from 'redux-persist/lib/storage'
import { Persistor } from 'redux-persist/es/types'
import { persistStore, persistReducer } from 'redux-persist'
import { DefaultValues } from 'types'

interface MyProps {
  children: ReactNode
  // eslint-disable-next-line react/require-default-props
  defaultValues?: DefaultValues
  // eslint-disable-next-line react/require-default-props
  disabledPersist?: boolean
}

const Providers = ({ children, defaultValues: root, disabledPersist = false }: MyProps) => {
  const store: Store<any, AnyAction> = createStore(
    disabledPersist ? storeReducers : persistReducer({ ...persistConfig, storage }, storeReducers),
    { root },
    // eslint-disable-next-line no-underscore-dangle
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
  const persistor: Persistor = persistStore(store)

  return (
    <Provider store={store}>
      {disabledPersist ? (
        children
      ) : (
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      )}
    </Provider>
  )
}
export default Providers
