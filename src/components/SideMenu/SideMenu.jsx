import React, { useState, useEffect,useRef } from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import { Layout, Menu} from 'antd';
import axios from 'axios';
import PubSub from 'pubsub-js'
import { connect } from 'react-redux';
import {
  DesktopOutlined,
  TeamOutlined,
  AuditOutlined,
  EyeInvisibleOutlined,
  EditOutlined,
  UploadOutlined,
  ProfileOutlined,
  FileSyncOutlined,
  ImportOutlined,
  LaptopOutlined,
  FileSearchOutlined,
  UserOutlined,
  ContactsOutlined,
  DisconnectOutlined,
  CopyOutlined,
  AimOutlined,
} from '@ant-design/icons';
import style from './SideMenu.module.css'


const { Sider } = Layout;
// 图标对应路由
const iconList = {
  '/home': <DesktopOutlined />,
  '/user-manage': <TeamOutlined />,
  '/user-manage/list': <UserOutlined />,
  '/right-manage': <ContactsOutlined />,
  '/right-manage/role/list': <AuditOutlined />,
  '/right-manage/right/list': <EyeInvisibleOutlined />,
  '/news-manage': <AimOutlined />,
  '/news-manage/add': <EditOutlined />,
  '/news-manage/draft': <CopyOutlined />,
  '/audit-manage': <FileSearchOutlined />,
  '/audit-manage/audit': <FileSyncOutlined />,
  '/audit-manage/list': <ProfileOutlined />,
  '/publish-manage': <ImportOutlined />,
  '/publish-manage/unpublished': <UploadOutlined />,
  '/publish-manage/published': <LaptopOutlined />,
  '/publish-manage/sunset': <DisconnectOutlined />,
}

 function SideMenu(props) {
  // const [collapsed, setCollapsed] = useState(false)
  const [items, setItems] = useState()
  // const [originItems,setOriginItems] = useState()
  //获取当前history中location的pathname,使得刷新也可默认展示之前点击的
  const {pathname : clickPath} = useLocation()
  const openKey = ['/'+clickPath.split('/')[1]]



  useEffect(() => {
    function updateObject(obj,oldKey,newKey)
    {
      for (let key in obj) 
      {
        if (obj.hasOwnProperty(key)) 
        {
          if (typeof obj[key] === "object" && obj[key] !== null && obj[key] !== undefined) {
            // 如果当前值是一个对象，则递归调用updateObject函数
            updateObject(obj[key], oldKey, newKey);
          } 
          if (key === oldKey) {
            // 如果当前键值与要更改的键值相同，则将其更新为指定的新值
            obj[newKey] = obj[key];
            delete obj[key]
          }
        }
      }
      return obj
   }
  
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      const data = updateObject(res.data,'title','label')
      // console.log("here ",JSON.parse(localStorage.getItem('token')))
      // let rights = JSON.parse(localStorage.getItem('token')).role.rights
      if(localStorage.getItem('token')!==null)
      {
        const {id:userId} = JSON.parse(localStorage.getItem('token'))
 
        axios.get(`http://localhost:8000/users?id=${userId}&_expand=role`).then(res=>{
          const {rights} = res.data[0].role
          // console.log(rights)
          let newData = data.filter(val=>val.pagepermisson===1)
  
        newData = newData.filter((val) => {
          val.icon = iconList[val.key]
          if (val.children.length === 0)
          {
            val.children = null
            
          }
          else {
            val.children = val.children.filter((children) => {
              children.icon = iconList[children.key]
              children['rightid'] = children.rightId
              delete children.rightId
              return children.pagepermisson === 1 && rights.indexOf(children.key)!==-1
            })
          }
          return rights.indexOf(val.key)!==-1
        })
        setItems(newData)
        })
      }
     
        
    
   
      
      // setOriginItems(data)
      
    })
  }, [])

  //订阅更新
  useEffect(()=>{
          // 深拷贝函数
  function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null || obj === undefined) {
      return obj;
    }
    let clone = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if(key==='title')
          clone['label'] = deepClone(obj['title']);
        else
          clone[key] = deepClone(obj[key]);
      }
    }
    return clone;
  }
    // PubSub.subscribe("collapsed", (name, data) => {
    //   setCollapsed(data)
    // })
    PubSub.subscribe("items", (name, data) => {
      data = deepClone(data)
      if(data.grade===1)
      {
        //删除一级菜单
        if(data.pagepermisson === 0)
        {
          const changeItems = originItemsRef.current.filter(val=>val.id!==data.id)
          ///
          setItems(changeItems)
          ///
          // setOriginItems(changeItems)
        }
        //添加一级菜单
        if(data.pagepermisson === 1)
        {
              var changeItems
              data.icon = iconList[data.key]
              if (data.children === undefined)
                changeItems = data
              else {
              
                changeItems = data.children.filter((children) => {
                  children.icon = iconList[children.key]
                  children['rightid'] = children.rightId
                  delete children.rightId
                  return children.pagepermisson === 1
                })
                data.children = changeItems
                changeItems = data
                
              }

            originItemsRef.current.push(changeItems)
            originItemsRef.current.sort(function(a,b){
              return a.id-b.id
            })

            setItems([...originItemsRef.current])
            // setOriginItems([...originItemsRef.current])

        }   
      }
      //二级页面
      else{
        //处理的数据
        data.icon = iconList[data.key]
        data['rightid'] = data.rightId
        delete data.rightId
        const {id:changeId,pagepermisson }= data
        //找到父亲
        const dataFather = originItemsRef.current.filter(val=>val.id===data.rightid)[0]
        
        //删除二级页面
        if(pagepermisson === 0)
        {
          // console.log(data)
          const changeItems = dataFather.children.filter(val=>val.id!==changeId)
          dataFather.children = changeItems.length ===0 ?null:changeItems
          setItems([...originItemsRef.current])
          // setOriginItems([...originItemsRef.current])
        }

        //添加二级页面
        else{
          if(dataFather.children === null)
            dataFather.children = []
          dataFather.children.push(data)
          dataFather.children.sort(function(a,b){
            return a.id-b.id
          })
          setItems([...originItemsRef.current])
          // setOriginItems([...originItemsRef.current])
        }
      }

    })
  },[])

 

  const originItemsRef = useRef(items)
  //永远与items的值保持一样
  useEffect(() => {
    originItemsRef.current = items
  }, [items])

  //重定向
  const navigate = useNavigate()

  const changeMenu = (item) => {
    navigate(item.key)
    
  }

  return (

    <Sider trigger={null} collapsible collapsed={props.collapsed}>
      <div style={{ height: "100%", display:'flex',flexDirection:"column"}}>
        <div className={style.logo}>全球新闻发布管理系统</div>
        <div style={{flex:'1',overflow:'auto'}}>
          <Menu theme="dark"
            mode="inline"
            selectedKeys={clickPath}
            defaultOpenKeys = {openKey}
            items={items || []}
            onSelect={changeMenu}
          />
        </div>
       
      </div>


    </Sider>
  )
}


export default connect((state)=>({collapsed:state.collapsedReducer}))(SideMenu)