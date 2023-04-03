import { legacy_createStore as createStore} from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import allReducers from "./reducers/index"

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['loadingReducer']
  }

//持久化redux
const persistedReducer = persistReducer(persistConfig, allReducers)
let store = createStore(persistedReducer,composeWithDevTools())
let persistor = persistStore(store)
export { store, persistor }

// export default createStore(allReducers,composeWithDevTools())