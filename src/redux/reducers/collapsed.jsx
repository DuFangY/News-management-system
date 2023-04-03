import {COLLAPSED} from '../constant'

const initalState = false
export default function collapsedReducer(preState = initalState,action)
{
    const{type,data} = action
    // console.log(action)
    switch(type){
        case COLLAPSED:return !data
        default:return preState
    }
}