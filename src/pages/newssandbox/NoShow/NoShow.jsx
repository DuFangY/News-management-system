import React from 'react'
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NoShow() {
  const navigate = useNavigate()
  const backHome = ()=>{
     //重定向
      navigate('/home')
  }
  return (
    <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary" onClick={backHome}>返回首页</Button>}
  />
  )
}
