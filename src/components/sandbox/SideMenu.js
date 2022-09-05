import React from 'react'
import { withRouter } from 'react-router-dom'

import './index.css'

import { Layout, Menu } from 'antd';
import {
    MailOutlined,
    AppstoreOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;


function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}


const items = [
    getItem('首页', '/home', <SettingOutlined />),
    getItem('用户管理', '/user-manage', <MailOutlined />, [
        getItem('用户列表', '/user-manage/list',)
    ]),
    getItem('权限管理', '/right-manage/', <AppstoreOutlined />, [
        getItem('角色列表', '/right-manage/role/list'),
        getItem('权限列表', '/right-manage/right/list'),
    ]),
];


function SideMenu(props) {
    console.log(props)
    const onClick = (e) => {
        console.log('click', e);
        // <Link to={{pathname:e.key}}>nnn</Link>
        props.history.push({ pathname: e.key})
    };
    return (
        <Sider trigger={null} collapsible collapsed={false}>
            <div className="logo">全球新闻发布系统</div>
            <Menu
                onClick={onClick}
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/home']}
                items={items}
            />
        </Sider>
    )
}
export default withRouter(SideMenu)
