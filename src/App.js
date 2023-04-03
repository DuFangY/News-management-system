import React, { Fragment} from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import axios from 'axios'

import indexRouter from './routers/indexRouter'

import './App.css'



export default function App() {

  let userInfo = JSON.parse(localStorage.getItem('token'))

  const navigate = useNavigate()

  userInfo !== null ? axios.get(`http://localhost:8000/users?_expand=role`).then(res => {
    const user = (res.data.filter(val => val.id === userInfo.id))[0]

    if (!user.roleState) {
      localStorage.removeItem('token')
      navigate("/login")
    }
    else {
      localStorage.setItem('token', JSON.stringify(user))
      userInfo = user
    }


  }) : userInfo = null
  const element = useRoutes(indexRouter(userInfo))

  //判断是否登录授权


  return (
    <Fragment>
      {element}
    </Fragment>
  )
}
