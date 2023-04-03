import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal,Switch,Popover } from 'antd';
import axios from 'axios';
import PubSub from 'pubsub-js';
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';

const { confirm } = Modal;

export default function RightList() {
  
  const [dataSource, setDataSource] = useState([])
  // const [isLoading,setIsLoading] = useState(false)
  
  useEffect(() => {
    nProgress.start()
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      const data = res.data
      data.map(val => {
        if (val.children.length === 0)
          delete val.children
        return 0
      })
      setDataSource(res.data)
      
    }).then(()=>{
      nProgress.done()
    })
 
  }, [])

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '路由',
      dataIndex: 'key',
      render: (key) => <Tag color='volcano'>{key} </Tag>
    },
    {
      title: '操作',
      render: (items) =>
      (
        <div>
          <Button danger shape="circle" icon=<DeleteOutlined /> onClick={showDeleteConfirm(items)} style={{ marginRight: "5px" }}></Button>
          
          <Popover content={<Switch checked={items.pagepermisson===1} onChange={()=> changePermission(items)}/>} title="配置" trigger={(items.pagepermisson === undefined || items.pagepermisson) ===999?"":"click"}>
            <Button type="primary" icon=<EditOutlined /> shape="circle" disabled={(items.pagepermisson === undefined|| items.pagepermisson === 999) }></Button>
          </Popover>
        </div>
      )
    }
  ];

  const changePermission = (items)=>{
    // setIsLoading(true)
    items.pagepermisson = items.pagepermisson===1?0:1
      //如果父亲被点击 儿子也禁用
    if(items.children !== undefined)
    {
      if(items.grade === 1 && items.pagepermisson === 0)
      {
        items.children.map((val)=>{
          if(val.pagepermisson === 1)
            val.pagepermisson = 999
          return 0
        })
      }
      if(items.grade === 1 && items.pagepermisson === 1)
      {
        items.children.map((val)=>{
          if(val.pagepermisson === 999)
            val.pagepermisson = 1
          return 0
        })
      }
    }
    setDataSource([...dataSource])
    if(items.grade===1)
      axios.patch(`http://localhost:8000/rights/${items.id}`,{
        pagepermisson:items.pagepermisson
      }).then(()=>{
        // setIsLoading(false)
      })
    else
      axios.patch(`http://localhost:8000/children/${items.id}`,{
        pagepermisson:items.pagepermisson
      }).then(()=>{
        // setIsLoading(false)
      })

      PubSub.publish('items',items)
  }
  const showDeleteConfirm = (items) => {
    return () => {
      confirm({
        title: '你确定要删除此项权限吗?',
        icon: <ExclamationCircleFilled />,
        content: '注意你正在删除首页权限列表',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // setIsLoading(true)
          if (items.grade === 1) {
            items.pagepermisson = 0 //表明删除
            PubSub.publish('items',items)
            axios.delete(`http://localhost:8000/rights/${items.id}`)
              .then(() => {
                setDataSource(dataSource.filter(val => val.id !== items.id))
                // setIsLoading(false)
              }).catch((error) => {
                console.log(error)
              })
          }
          else {
            //对页面可展示区域进行消息发布更新
            if(items.pagepermisson!==undefined)
            {
              items.pagepermisson = 0 //表明删除
              PubSub.publish('items',items)
            }

            axios.delete(`http://localhost:8000/children/${items.id}`)
              .then(() => {
               
                setDataSource(dataSource.filter(val => {
                  if (val.children) {
                    val.children = val.children.filter(val => {
                      return val.id !== items.id
                    })
                  }
                  return val
                }))
                // setIsLoading(false)
              }).catch((error) => {
                console.log(error)
              })
          }
        },
        onCancel() {
          console.log('No delete');
        },
      });
    }

  };

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: "5" }} />
      {/* <Spin tip="Loading" size="small"  spinning={isLoading} style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}></Spin> */}
      
    </div>
  )
}
