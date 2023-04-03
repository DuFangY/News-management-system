import React,{useEffect,useState} from 'react'
import { Button,notification} from 'antd'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  RotateRightOutlined
} from '@ant-design/icons';
import NewsPublish from '../../../components/Publish-manage/NewsPublish'

export default function Published() {
  const User = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const [api, contextHolder] = notification.useNotification()
  const {username} = User

  //Table控件的列属性
  const columns = [
    {
      title: '新闻标题',
      render: (items) => {
        const path = `/news-manage/preview/${items.id}`
        return <NavLink to={path}>{items.title}</NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (items) => items.title
    },
    {
      title: '操作',
      render: (items) =>
      (<div>
        <Button  type="primary"  danger ghost shape="round" icon={<RotateRightOutlined/>} children='下线' onClick={()=>{offOnline(items)}}/>
      </div>
      )

    }
  ]
  useEffect(() => {
    nProgress.start()
    //登录用户待发布的信息
    axios.get(`http://localhost:8000/news?author=${username}&publishState=2&_expand=category`).then(
      (res) => {
        //登陆者信息
        setDataSource(res.data)
      }
    ).then(() => nProgress.done())
  }, [username])

  const offOnline = (items)=>{
    axios.patch(`http://localhost:8000/news/${items.id}`,{
      publishState:3
    }).then(()=>{
      const data = dataSource.filter(val=>val.id!==items.id)
      setDataSource(data)
      api.info({
        message: '通知',
        description: '您可以到【发布管理/已下线】中查看下线的文章' ,
        placement: 'bottomRight',
    })

    })
  }
  return (
    <div>
      {contextHolder}
      <NewsPublish dataSource={dataSource} columns = {columns}/>
    </div>
  )
}
