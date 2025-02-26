import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { createStore, Store, AnyAction } from 'redux'
import { storeReducers } from '@jsonui/core'
import { DefaultValues } from 'types'

interface MyProps {
  children: ReactNode
  // eslint-disable-next-line react/require-default-props
  defaultValues?: DefaultValues
}

const Providers = ({ children, defaultValues: root }: MyProps) => {
  const store: Store<any, AnyAction> = createStore(
    storeReducers,
    { root },
    // eslint-disable-next-line no-underscore-dangle
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )

  return <Provider store={store}>{children}</Provider>
}
export default Providers
