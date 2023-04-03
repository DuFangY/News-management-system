import React, { useState, useEffect } from 'react'
import { Table, Button, Modal,Tree } from 'antd';
import axios from 'axios'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';

const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [treeRightCurrent,setTreeRightCurrent] = useState([])
  const [currentModal,setCurrentModal] = useState()

  //Table控件的列属性
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (items) =>
      (
        <div>
          <Button danger shape="circle" icon=<DeleteOutlined /> onClick={showDeleteConfirm(items)} style={{ marginRight: "5px" }} ></Button>

          <Button type="primary" icon=<EditOutlined /> shape="circle" onClick={showModal(items)}></Button>
        </div>
      )
    }
  ]
  useEffect(() => {
    nProgress.start()
    axios.get('http://localhost:8000/roles').then(res => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      setTreeData(res.data)
    }).then(()=>{
      nProgress.done()
    })
  }, [])

  //删除角色对话框
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
          axios.delete(`http://localhost:8000/roles/${items.id}`)
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

  //修改模态框
  const showModal = (items) => {
    return ()=>{
      setIsModalOpen(true);
      //
      setTreeRightCurrent(items.rights)
      setCurrentModal(items)
    }
   
  };
  const handleOk = () => {
    // console.log('okk')
    // setIsLoading(true)
    setDataSource(dataSource.map(val=>{
      if(val.id === currentModal.id)
        val.rights = treeRightCurrent
      return val
    }))
    axios.patch(`http://localhost:8000/roles/${currentModal.id}`,{
        rights:treeRightCurrent
      }).then(()=>{
        // setIsLoading(false)
      })
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    console.log('cancel ')
    setIsModalOpen(false);
  };
  const onCheck = (checkedKeys,info) => {

    const {node} = info
    let checked = checkedKeys.checked
    //一级菜单取消选中 下级菜单全部取消
    if(!info.checked && node.grade===1)
    {
        if(node.children.length!==0)
        {
          const childrenId = node.children.map(child=>child.id)
           checked = info.checkedNodes.map((checked)=>{
            if(childrenId.indexOf(checked.id)===-1)
              return checked.key
            return ""
          })
          checked = checked.filter(val=>val!=="")
        }    
    }
    // //二级菜单选中 一菜单必须选中
    if(info.checked && node.grade===2)
    {
      let fatherChecked = info.checkedNodes.filter(val=>val.id===node.rightId)
      //父亲节点没被选中,则要添加
      if(fatherChecked.length === 0)
      {
        fatherChecked  = treeData.filter(data=>data.id===node.rightId)
        checked = [fatherChecked[0].key,...checked]
      }
    }
    //二级菜单取消，判断是否此项二级菜单全部取消，若是，一级菜单取消
    if(!info.checked && node.grade === 2)
    {
      //获取 取消的菜单的父亲
      const fatherChecked = info.checkedNodes.filter(val=>val.id===node.rightId)
      //获取到同级的key
      let mates = fatherChecked[0].children.map(val=>val.key)
      mates = mates.filter(val=>val!==node.key)
      const flag = mates.filter(val=>checked.indexOf(val)!==-1)

      //该项同级别所有元素都没有被选中，其父亲取消选择
      if(flag.length===0)
      {
        //获取要取消的父亲的key
        const fatherCancel = fatherChecked[0].key
        checked = checked.filter(val=>val!==fatherCancel)
      }
    }
    setTreeRightCurrent(checked)

  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: "5" }} ></Table>
      {/* <Spin tip="Loading" size="small" spinning={isLoading} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}></Spin> */}
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly={true}
          checkedKeys={treeRightCurrent}
          onCheck={onCheck}
          treeData={treeData}
        />
      </Modal>
    </div>
  )
}
