import {LOADING} from '../constant'

const initalState = false
export default function loadingReducer(preState = initalState,action)
{
    const{type,data} = action
    switch(type){
        case LOADING:return data
        default:return preState
    }
}