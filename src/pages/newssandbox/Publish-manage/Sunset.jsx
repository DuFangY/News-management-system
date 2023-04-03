import React,{useEffect,useState} from 'react'
import { Button,notification,Modal} from 'antd'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  DeleteOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import NewsPublish from '../../../components/Publish-manage/NewsPublish'

export default function Sunset() {
  const User = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  const [api, contextHolder] = notification.useNotification()
  // const [isLoading, setIsLoading] = useState(false)
  const { confirm } = Modal
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
        <Button  danger shape="round" icon={<DeleteOutlined/>} children='删除' onClick={()=>{showDeleteConfirm(items)}}/>
      </div>
      )

    }
  ]
  useEffect(() => {
    nProgress.start()
    //登录用户待发布的信息
    axios.get(`http://localhost:8000/news?author=${username}&publishState=3&_expand=category`).then(
      (res) => {
        //登陆者信息
        setDataSource(res.data)
      }
    ).then(() => nProgress.done())
  }, [username])



      //删除新闻
      const showDeleteConfirm = (items) => {
          confirm({
            title: '你确定要删除此条新闻吗?',
            icon: <ExclamationCircleFilled />,
            content: '注意你正在删除此条新闻',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              // setIsLoading(true)
              axios.delete(`http://localhost:8000/news/${items.id}`).then(()=>{
                const data = dataSource.filter(val=>val.id!==items.id)
                setDataSource(data)
                // setIsLoading(false)
                api.info({
                  message: '通知',
                  description: '删除新闻成功' ,
                  placement: 'bottomRight',
              })})
            },
            onCancel() {
              console.log('No delete');
            },
          });
      }
  return (
    <div>
      {contextHolder}
      <NewsPublish dataSource={dataSource} columns = {columns}/>
      {/* <Spin tip="Loading" size="small" spinning={isLoading} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}></Spin> */}
    </div>
  )
}
