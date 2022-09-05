import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import TopHeader from '../../components/sandbox/TopHeader'
import SideMenu from '../../components/sandbox/SideMenu'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import NotFound from './nopermission/NotFound'

//css
import './NewsSandBox.css'

//antd
import { Layout } from 'antd'
const {Content} = Layout

export default function NewsSandBox() {
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >

                    {/*  */}
                    <Switch>
                        <Route path='/home' component={Home} />
                        <Route path='/user-manage/list' component={UserList} />
                        <Route path='/right-manage/right/list' component={RightList} />
                        <Route path='/right-manage/role/list' component={RoleList} />

                        {/* 重定向 */}

                        {/* 模糊匹配 */}
                        {/* <Redirect from='/' to='/home' /> */}
                        {/* 精确匹配 */}
                        <Redirect from='/' to='/home' exact />
                        <Route path='*' component={NotFound} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}
