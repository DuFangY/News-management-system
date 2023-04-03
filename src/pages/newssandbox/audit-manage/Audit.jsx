import React, { useEffect, useState } from 'react'
import { Table, Button, notification } from 'antd'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const [api, contextHolder] = notification.useNotification()
  const User = JSON.parse(localStorage.getItem('token'))
  const { region, roleId } = User
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
        <Button type='primary' style={{ marginRight: "10px" }} onClick={() => checkOk(items)}>通过</Button>
        <Button danger onClick={() => checkBack(items)}>驳回</Button>
      </div>
      )

    }
  ]
  //获取审核数据
  useEffect(() => {
    nProgress.start()
    axios.get(`http://localhost:8000/news?auditState=1&_expand=category`).then(res => {
      roleId === 1 ? setDataSource(res.data) : setDataSource(res.data.filter(val => val.region === region))
    }).then(() => nProgress.done())
  }, [region, roleId])

  //审核通过
  const checkOk = (items) => {
    axios.patch(`http://localhost:8000/news/${items.id}`, {
      auditState: 2, //审核通过
      publishState: 1 //设置已发布状态
    }).then(() => {
      setDataSource(dataSource.filter(val => val.id !== items.id))
      api.info({
        message: '通知',
        description: '您审核通过了一条新闻',
        placement: 'bottomRight',
      })
    })
  }
  //审核拒绝
  const checkBack = (items)=>{
    axios.patch(`http://localhost:8000/news/${items.id}`, {
      auditState: 3, //审核拒绝
    }).then(() => {
      setDataSource(dataSource.filter(val => val.id !== items.id))
      api.info({
        message: '通知',
        description: '您审核拒绝了一条新闻',
        placement: 'bottomRight',
      })
    })
  }

  return (
    <div>
      {contextHolder}
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: "5" }} ></Table>
    </div>
  )
}

