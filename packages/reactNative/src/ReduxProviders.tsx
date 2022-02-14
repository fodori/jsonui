import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import storeConfigure from './store/store'

function Providers({ children }: { children: ReactNode }) {
  const { store, persistor } = storeConfigure
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
export default Providers
