import React from 'react'
import { Outlet} from 'react-router-dom'
import { Layout, theme,Spin } from 'antd';
import { connect } from 'react-redux';
import TopHeader from '../../components/TopHeader/TopHeader'
import SideMenu from '../../components/SideMenu/SideMenu'
import './NewsSandBox.css'



const { Content } = Layout;
function NewsSandBox(props) {

    const { token: { colorBgContainer }, } = theme.useToken();
    
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    style={{
                        position:'relative',
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        overflow:'auto'
                    }}
                >
                    <Spin tip="Loading" size="large"  spinning={props.loading} style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
                        <Outlet />
                    </Spin>
                </Content>

            </Layout>
        </Layout>
    )
}
export default connect((state)=>({loading:state.loadingReducer}))(NewsSandBox)