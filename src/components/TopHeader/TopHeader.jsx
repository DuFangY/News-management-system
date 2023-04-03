import React from 'react'
import { Layout, theme,Dropdown,Avatar} from 'antd';
// import PubSub from 'pubsub-js'
//引入用于连接container组件和UI组件的方法
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { collapsedActions } from '../../redux/actions/collapsed';
const { Header } = Layout;

function TopHeader(props) {
  //设置折叠初始状态为false
  // const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer }, } = theme.useToken();
  const userInfo = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  // const changeCollapsed = () => {

  //    PubSub.publish("collapsed", !collapsed)
  //    setCollapsed(!collapsed)
  // }

  const items = [
    {
      key: 'manage',
      label:userInfo.role.roleName
    },
    {
      key: 'exit',
      danger: true,
      label: '退出',
    },
  ];

  const onClick = (event) => {
    if(event.key==='exit')
    { 
      localStorage.removeItem('token')
      navigate('/login')
    }
      
  };
  return (

    <Header
      style={{
        padding: '0 16px',
        background: colorBgContainer,
      }}
    >
      {
        props.collapsed ? <MenuFoldOutlined className='trigger' onClick={()=>props.collapsedClick(props.collapsed)} /> :
          <MenuUnfoldOutlined className='trigger' onClick={()=>props.collapsedClick(props.collapsed)} />
      }
      <div style={{ float: 'right' }}>
        <span style={{marginRight:"10px"}}>
          欢迎 <span style={{fontSize:'20px',fontWeight:'700'}}>{userInfo.username}</span> 回来
        </span>
        <Dropdown menu={{items,onClick}}>
            <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}


export default connect((state)=>({collapsed:state.collapsedReducer}),{
  collapsedClick:collapsedActions
})(TopHeader)