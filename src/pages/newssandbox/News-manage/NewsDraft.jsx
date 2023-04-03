import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { Table, Button, Modal,notification } from 'antd'

import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
const { confirm } = Modal
export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()
  //Table控件的列属性
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (items) => <b>{items}</b>
    },
    {
      title: '新闻标题',
      render: (items) =>{
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
       ( <div>
          <Button danger shape="circle" icon=<DeleteOutlined/> style={{ marginRight: "5px" }} onClick={showDeleteConfirm(items)}></Button>
          <Button icon=<EditOutlined /> shape="circle" style={{ marginRight: "5px" }} onClick={()=>updateNews(items)}></Button>
          <Button type="primary" icon=<UploadOutlined /> shape="circle" onClick={()=>{
            handelCheck(items)
          }}></Button>
          </div>
       )
      
    }
  ]
  //获取登陆者草稿箱
  useEffect(() => {
    nProgress.start()
    const User = JSON.parse(localStorage.getItem('token'))

    axios.get(`http://localhost:8000/news?author=${User.username}&auditState=0&_expand=category`).then(
      (res) => {
        //登陆者信息
        // console.log(res.data)
        setDataSource(res.data)

      }
    ).then(() => nProgress.done())
  }, [])

    //删除新闻
    const showDeleteConfirm = (items) => {
      return () => {
        confirm({
          title: '你确定要删除此条新闻吗?',
          icon: <ExclamationCircleFilled />,
          content: '注意你正在删除草稿箱中的新闻',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            // setIsLoading(true)
            axios.delete(`http://localhost:8000/news/${items.id}`)
              .then(() => {
                setDataSource(dataSource.filter(val => val.id !== items.id))
                // setIsLoading(false)
              }).catch((error) => {
                console.log(error)
              })
          },
          onCancel() {
            console.log('No delete');
          },
        });
      }
  
    };

    //更新新闻
    const updateNews = (items)=>{
      navigate(`/news-manage/update/${items.id}`)
    }
    //提交审核
    const handelCheck = (items)=>{
      // setIsLoading(true)
      axios.patch(`http://localhost:8000/news/${items.id}`,{
        auditState:1
      }).then(()=>{
        const data = dataSource.filter(val=>val.id!==items.id)
        api.info({
          message: '通知',
          description: '您可以到审核列表中查看待审核的文章',
          placement: 'bottomRight',
        })
        // setIsLoading(false)
        setDataSource(data)
      })
    }
  return (
    <div>
      {contextHolder}
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: "5" }} ></Table>
      {/* <Spin tip="Loading" size="small" spinning={isLoading} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}></Spin> */}
    </div>    
   
  )
}
