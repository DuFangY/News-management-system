import { combineReducers } from "redux";
import collapsedReducer from './collapsed'
import loadingReducer from './loading'


export default combineReducers({
    collapsedReducer,
    loadingReducer
})