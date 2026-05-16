import React from 'react'
import { createStore, type Store, type AnyAction } from 'redux'
import { Provider } from 'react-redux'
import FormViewer from './FormViewer.js'

const reducer = (state: Record<string, unknown> = {}, action: AnyAction) => {
  switch (action.type) {
    case 'SAVE_FORM': {
      return {
        ...state,
        [(action.payload as { id: string }).id]: (action.payload as { defaultValue: unknown }).defaultValue,
      }
    }
    default:
      return state
  }
}
const store: Store<Record<string, unknown>, AnyAction> = createStore(reducer)

const Main = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'space-around', gap: 10 }}>
      <Provider store={store}>
        <FormViewer />
      </Provider>
    </div>
  )
}

export default Main
