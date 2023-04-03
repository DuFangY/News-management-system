import axios from "axios";
import {store} from '../redux/store'
import {loadingActions} from '../redux/actions/loading'
axios.interceptors.request.use((config)=>{
    store.dispatch(loadingActions(true))
    return config
},(error)=>{
    return Promise.reject(error)
})

axios.interceptors.response.use((res)=>{
    store.dispatch(loadingActions(false))
    return res
},(error)=>{
    store.dispatch(loadingActions(false))
    return Promise.reject(error)
})