import React from 'react'
import { Provider } from 'react-redux'
import { createStore, Store, AnyAction } from 'redux'
import { storeReducers } from '@jsonui/core'
import { DefaultValues, GetFormState } from 'types'

interface Props {
  children: React.ReactNode
  // eslint-disable-next-line react/require-default-props
  defaultValues?: DefaultValues
  // eslint-disable-next-line react/require-default-props
  getFormState?: GetFormState
}

const Providers = ({ children, defaultValues: root, getFormState: getState }: Props) => {
  const store: Store<any, AnyAction> = createStore(
    storeReducers,
    { root },
    // eslint-disable-next-line no-underscore-dangle
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
  if (getState) {
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unused-vars
    getState.current = () => store.getState()?.root // root contanins form data
  }

  // Type assertion to handle React 19 compatibility with react-redux
  const ReduxProvider = Provider as React.ComponentType<{ store: Store<any, AnyAction>; children: React.ReactNode }>

  return <ReduxProvider store={store}>{children}</ReduxProvider>
}
export default Providers
