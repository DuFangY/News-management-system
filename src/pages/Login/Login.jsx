import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import Background from '../../components/Background/Background';
import './Login.css'
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate()
  const onFinish = (values) => {
    // console.log("表单输入数据: ",values);
    const {username,password} = values
    axios.get(`http://localhost:8000/users?username=${username}&password=${password}&roleState=true&_expand=role`).then(res=>{
      // console.log(res.data)
      if(res.data.length===0)
        message.error('用户名或密码不匹配！')
      else
      {
        localStorage.setItem('token',JSON.stringify(res.data[0]))
        navigate('/')
      }
    })
  }

  return (
    <div style={{ background: 'rgba(35,39,65)', minHeight: '100vh'}}>
      <Background />
      <div className="login-container">
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <div className='title'>全球新闻发布管理系统</div>
          {/* username */}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '用户名不能为空!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          {/* password */}
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '密码输入不能为空！',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          {/* 登录按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
