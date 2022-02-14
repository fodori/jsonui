import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { persistConfig, storeReducers } from '@jsonui/core'

const reducerConfig = { ...persistConfig, storage } // ersistConfig<CombinedState< root: any;}>, any, any, any>
const persistedReducer = persistReducer(reducerConfig, storeReducers)

// eslint-disable-next-line no-underscore-dangle
const store = createStore(persistedReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__())
const persistor = persistStore(store)

const storeObj = { store, persistor }
export default storeObj
