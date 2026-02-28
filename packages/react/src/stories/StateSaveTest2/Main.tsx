import React from 'react'
import FormViewer from './FormViewer'
import { createStore, Store, AnyAction } from 'redux'
import { Provider } from 'react-redux'

const reducer = (state = {}, action: AnyAction) => {
  switch (action?.type) {
    case 'SAVE_FORM': {
      return {
        ...state,
        [action.payload.id]: action.payload.defaultValue,
      }
    }
    default:
      return state
  }
}
const store: Store<any, AnyAction> = createStore(reducer)

const Main = () => {
  const root: any = {}
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'space-around', gap: 10 }}>
      <Provider store={store}>
        <FormViewer />
      </Provider>
    </div>
  )
}

export default Main
