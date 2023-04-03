import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Switch, Modal } from 'antd'

import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import '../../../components/UserForm/UserForm'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import UserForm from '../../../components/UserForm/UserForm';


const { confirm } = Modal
export default function UserList() {

  const [dataSource, setDataSource] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  const [addUserVisible, setAddUserVisible] = useState(false)
  const [updateUserVisible, setUpdateUserVisible] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])
  const [regionDisabled, setRegionDisabled] = useState(false)
  const [roleDisabled,setRoleDisabled] = useState(false)
  const [currentUpdate,setCurrentUpdate] = useState()
  const [loginUser,setLoginUser] = useState()
  const refForm = useRef() //UserForm组件中form表单的props
  const updateForm = useRef() 

  //传给UserForm组件的props
  const formProps = {
    regionList,
    roleList,
    regionDisabled,
    setRegionDisabled,
    roleDisabled,
    // setRoleDisabled
  }
  //Table控件的列属性
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [...regionList.map(val => ({ text: val.title, value: val.value }))],
      filterMode: 'menu',
      filterSearch: true,
      onFilter: (value, record) => record.region.includes(value),
      render: (items) => <strong>{items}</strong>
    },
    {
      title: '角色名称',
      render: (items) => items.role.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      render: (items) => <Switch checked={items.roleState} disabled={items.default || items.id === loginUser.id ? true : false} onChange={(checked) => { onChange(checked, items) }} />

    },
    {
      title: '操作',
      render: (items) =>
      (
        <div>
          <Button danger shape="circle" icon=<DeleteOutlined /> disabled={items.default || items.id === loginUser.id ? true : false} style={{ marginRight: "5px" }} onClick={showDeleteConfirm(items)} ></Button>

          <Button type="primary" icon=<EditOutlined /> shape="circle" disabled={items.default ? true : false} onClick={()=>{showUpdate(items)}} ></Button>
        </div>
      )
    }
  ]


  //用户状态点击按钮,点击后修改该用户状态
  const onChange = (checked, items) => {
    // console.log(items)
    // console.log(`switch to ${checked}`);
    const newDataSource = dataSource.map(val => {
      if (val.id === items.id)
        val.roleState = checked
      return val
    })
    setDataSource(newDataSource)
    // setIsLoading(true)
    axios.patch(`http://localhost:8000/users/${items.id}`, {
      roleState: checked
    }).then(() => {
      // setIsLoading(false)
    })
  };
  //dataSource
  useEffect(() => {
    nProgress.start()
    const {id:userId} = JSON.parse(localStorage.getItem('token'))
  
    axios.get('http://localhost:8000/users?_expand=role').then(
      (res) => {
        //登陆者信息
        const user = res.data.filter(val=>val.id===userId)
        
        setLoginUser(user[0])
        const otherUsers = res.data.filter(val=>val.region===user[0].region && val.roleId === 3 && val.id!==user[0].id)
        user[0].roleId===1 ?setDataSource(res.data) :setDataSource([...user,...otherUsers])

      }
    )
  }, [])
  //regionList
  useEffect(() => {
    axios.get('http://localhost:8000/regions').then(
      (res) => {
        setRegionList(res.data.filter(val => val.title !== '全球'))
      }
    )
  }, [])
  //roleList
  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(
      (res) => {
        setRoleList(res.data)
      }
    ).then(()=>{
      nProgress.done()
    })
  }, [])

  //删除用户
  const showDeleteConfirm = (items) => {
    return () => {
      confirm({
        title: '你确定要删除此项用户吗?',
        icon: <ExclamationCircleFilled />,
        content: '注意你正在删除首页系统用户',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // setIsLoading(true)
          axios.delete(`http://localhost:8000/users/${items.id}`)
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

  const addClick = () => { 
    if(loginUser.roleId===2)
    {
      setRegionDisabled(true)
      setRoleDisabled(true)
    }
      
    setAddUserVisible(pre => !pre) 
  }
  //添加用户按钮点击确认添加
  const addUser = () => {

    console.log("点击了添加用户")
    refForm.current.validateFields().then(res => {
      console.log(res)
      // setIsLoading(true)
      const { username, password, region, roleId } = res
      let addObj = {
        username,
        password,
        roleState: true,
        default: false,
        region,
        roleId,
      }
      axios.post('http://localhost:8000/users', addObj).then(() => {
        //匹配到添加的用户的role对象
        const roleObj = roleList.filter(val => val.id === roleId)
        //界面更新需要的用户obj
        addObj = { ...addObj, role: roleObj[0], id: dataSource.length + 1 }
        setDataSource([...dataSource, addObj])
        console.log('添加用户ok')
        setAddUserVisible(pre => !pre)
        // setIsLoading(false)
        refForm.current.resetFields()
        setRegionDisabled(false)
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)

    })

  }
  //添加用户按钮点击取消
  const addUserCancel = () => {
    refForm.current.resetFields()
    setRegionDisabled(false)
    console.log('添加用户cancel')
    setAddUserVisible(pre => !pre)
  }

  //展示更新用户Modal
  const showUpdate = (items) => {
    //这里需要让状态更新的异步操作和后续执行变成“同步”操作
    setUpdateUserVisible(pre => !pre)
    setTimeout(()=>{
      const {username,password,region,roleId} = items
      setCurrentUpdate(items.id)
      updateForm.current.setFieldsValue({username,password,region,roleId} )
      if(region==="全球")
        setRegionDisabled(true)
      else
        setRegionDisabled(false)
      if(loginUser.roleId===2)
      {
        setRegionDisabled(true)
        setRoleDisabled(true)
      }
        
    },0)

    
  }
  //更新用户按钮点击确认更新
  const updateUser = () => {

    updateForm.current.validateFields().then(res=>{
      // setIsLoading(true)
      dataSource.forEach(val=>{
        if(val.id===currentUpdate)
        {
          val.password = res.password
          val.region = res.region
          val.roleId = res.roleId
          val.username = res.username
          val.role = (roleList.filter(roleValue=>roleValue.id === val.roleId))[0]
        }
      })

      axios.patch(`http://localhost:8000/users/${currentUpdate}`,{
        password:res.password,
        region:res.region,
        roleId :res.roleId,
        username :res.username
      }).then(()=>{
        // setIsLoading(false)
      }).catch(error=>{
        console.log(error)
      })
      setDataSource([...dataSource])
    })
    setUpdateUserVisible(pre => !pre)
  }
  //更新用户按钮点击取消
  const updateUserCancel = () => {
    setUpdateUserVisible(pre => !pre)
  }

  return (
    <div>
      <Button type="primary" style={{ marginBottom: '10px' }} onClick={addClick}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: "5" }} ></Table>
      {/* 添加用户 */}
      <Modal
        open={addUserVisible}
        title="添加用户"
        okText="添加"
        cancelText="取消"
        onCancel={addUserCancel}
        onOk={addUser}
      >
        <UserForm {...formProps} ref={refForm} isAddUsers = {true} loginUser = {loginUser}/>
      </Modal>

      {/* 更新用户 */}
      <Modal
        open={updateUserVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={updateUserCancel}
        onOk={updateUser}
      >
        <UserForm {...formProps} ref={updateForm} isAddUsers = {false} loginUser = {loginUser}/>
      </Modal>

      {/* <Spin tip="Loading" size="small" spinning={isLoading} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}></Spin> */}
    </div>
  )
}
