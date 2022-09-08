import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import TopHeader from '../../components/sandbox/TopHeader'
import SideMenu from '../../components/sandbox/SideMenu'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import NotFound from './nopermission/NotFound'
import NewsAdd from './news-manage/NewsAdd'
import NewsDraft from './news-manage/NewsDraft'
import NewsUpdate from './news-manage/NewsUpdate'
import NewsPreview from './news-manage/NewsPreview'
import AuditList from './audit-manage/AuditList'
import Audit from './audit-manage/Audit'
import Unpublished from './publish-manage/Unpublished'
import Published from './publish-manage/Published'
import Sunset from './publish-manage/Sunset'
import Category from './news-manage/NewsCategory'
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

                        <Route path='/news-manage/add' component={NewsAdd}/>
                        <Route path='/news-manage/draft' component={NewsDraft}/>
                        <Route path='/news-manage/update' component={NewsUpdate}/>
                        <Route path='/news-manage/category' component={Category}/>
                        <Route path='/news-manage/preview/:id' component={NewsPreview}/>

                        <Route path='/audit-manage/list' component={AuditList}/>
                        <Route path='/audit-manage/audit' component={Audit}/>

                        <Route path='/publish-manage/unpublished' component={Unpublished}/>
                        <Route path='/publish-manage/published' component={Published}/>
                        <Route path='/publish-manage/sunset' component={Sunset}/>

                        


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
