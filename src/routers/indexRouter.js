import { Navigate } from 'react-router-dom'
import Login from '../pages/Login/Login'
import NewsSandBox from '../pages/newssandbox/NewsSandBox'
import Home from '../pages/newssandbox/home/Home'
import UserList from '../pages/newssandbox/User-manage/UserList'
import RoleList from '../pages/newssandbox/Right-manage/RoleList'
import RightList from '../pages/newssandbox/Right-manage/RightList'
import NoShow from '../pages/newssandbox/NoShow/NoShow'
import AuditList from '../pages/newssandbox/audit-manage/AuditList'
import Audit from '../pages/newssandbox/audit-manage/Audit'
import NewsAdd from '../pages/newssandbox/News-manage/NewsAdd'
import NewsDraft from '../pages/newssandbox/News-manage/NewsDraft'
import NewsPreview from '../pages/newssandbox/News-manage/NewsPreview'
import NewsUpdate from '../pages/newssandbox/News-manage/NewsUpdate'
import Published from '../pages/newssandbox/Publish-manage/Published'
import Unpublished from '../pages/newssandbox/Publish-manage/Unpublished'
import Sunset from '../pages/newssandbox/Publish-manage/Sunset'
import News from '../pages/News/News'
import Detail from '../pages/Detail/Detail'

export default function indexRouter(isLoggedin) {
    // console.log("@@",isLoggedin)
    let children=[
        {
            path:'/home',
            element:<Home/>
        },
        {
            path:'/user-manage/list',
            element:<UserList/>
        },
        {
            path:'/right-manage/role/list',
            element:<RoleList/>
        },
        {
            path:'/right-manage/right/list',
            element:<RightList/>
        },
        {
            path:'/news-manage/add',
            element:<NewsAdd/>
        },
        {
            path:'/news-manage/draft',
            element:<NewsDraft/>
        },
        {
            path:'/news-manage/preview/:id',
            element:<NewsPreview/>
        },
        {
            path:'/news-manage/update/:id',
            element:<NewsUpdate/>
        },
        {
            path:'/audit-manage/audit',
            element:<Audit/>
        },
        {
            path:'/audit-manage/list',
            element:<AuditList/>
        },
        {
            path:'/publish-manage/published',
            element:<Published/>
        },
        {
            path:'/publish-manage/unpublished',
            element:<Unpublished/>
        },
        {
            path:'/publish-manage/sunset',
            element:<Sunset/>
        },
        //默认重定向Home组件
        {
            path:'/',
            //
            element:<Navigate to='/home'/>
        },
        //匹配不到所有路由，展示此组件
        {
            path:'*',
            element:<NoShow/>
        }
    ]
    if(isLoggedin)
    {
        // console.log(isLoggedin.role.rights)
        children = children.filter(val=>isLoggedin.role.rights.indexOf(val.path)!==-1 || val.path==='*' || val.path==='/')

        // console.log(children)
    }
        
    const element = [
        {
            path:'/login',
            element:<Login/>
        },
        {
            path:'/news',
            element:<News/>
        },
        {
            path:'/detail/:id',
            element:<Detail/>
        },
        {
            path:'/',
            element:isLoggedin?<NewsSandBox/>:<Login/>,
            children
        }
    ]
    return element
}



