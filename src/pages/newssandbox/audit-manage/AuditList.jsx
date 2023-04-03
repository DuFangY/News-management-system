import React, { useEffect, useState } from 'react'
import { Table, Button,Tag,notification} from 'antd'
import { NavLink, useNavigate} from 'react-router-dom'
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  RotateLeftOutlined
} from '@ant-design/icons';


export default function AuditList() {
  const [dataSource, setDataSource] = useState([])
  const [api, contextHolder] = notification.useNotification()
  const User = JSON.parse(localStorage.getItem('token'))
  const {username} = User
  const navigate = useNavigate()
  const auditList = ['未审核','待审核','已通过','未通过']
  // const publishList = ['未发布','待发布','已发布','已下线']

  // ['未审核 0','待审核 1','已通过 2','未通过 3']
  //颜色对应 正在审核1 审核通过2 审核未通过3
  const tagColor = ['processing','success','error']
  const buttonDo = ['撤销','发布','修改']

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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (items) => <Tag color={tagColor[items-1]} children={auditList[items]}></Tag>
    },
    {
      title: '操作',
      render: (items) =>
      (<div>
        <Button type="primary" shape="round" icon={<RotateLeftOutlined/>} children={buttonDo[items.auditState-1]} onClick={()=>{cancelCheck(items)}}/>
      </div>
      )

    }
  ]

  //获取登陆者审核列表
  useEffect(() => {
    nProgress.start()

    //审核状态不为 未审核 发布状态为 未发布或待发布
    axios.get(`http://localhost:8000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(
      (res) => {
        //登陆者信息
        setDataSource(res.data)
      }
    ).then(() => nProgress.done())
  }, [username])


  //撤销、发布、修改审核状态
  const cancelCheck = (items)=>{

    //撤销审核
    if(items.auditState===1)
    {
      axios.patch(`http://localhost:8000/news/${items.id}`,{
        auditState:0
      }).then(()=>{
        const data = dataSource.filter(val=>val.id!==items.id)
        setDataSource(data)
        api.info({
          message: '通知',
          description: '撤销审核成功，您可以到草稿箱中查看撤销的文章' ,
          placement: 'bottomRight',
      })
      })
    }
    //发布已经通过审核
    if(items.auditState===2)
    {
      axios.patch(`http://localhost:8000/news/${items.id}`,{
        publishState:2,
        publishTime:Date.now()
      }).then(()=>{
        const data = dataSource.filter(val=>val.id!==items.id)
        setDataSource(data)
        api.info({
          message: '通知',
          description: '发布成功，您可以到【发布管理/已发布】中查看发布的文章' ,
          placement: 'bottomRight',
      })
        console.log('发布成功！')
      })
    }
    //修改未通过审核
    if(items.auditState===3)
    {
      navigate(`/news-manage/update/${items.id}`)
    }

  }
  return (
    <div>
      {contextHolder}
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: "5" }} ></Table>
    </div>
  )
}

