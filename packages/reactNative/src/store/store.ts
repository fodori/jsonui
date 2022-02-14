import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-async-storage/async-storage'

import { persistConfig, storeReducers } from '@jsonui/core'

const reducerConfig = { ...persistConfig, storage } // ersistConfig<CombinedState< root: any;}>, any, any, any>
const persistedReducer = persistReducer(reducerConfig, storeReducers)

// eslint-disable-next-line no-underscore-dangle
const store = createStore(persistedReducer)
const persistor = persistStore(store)

const storeObj = { store, persistor }
export default storeObj
