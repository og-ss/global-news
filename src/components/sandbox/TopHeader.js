import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar, } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;

//key label icon disabled
const menu = (
    <Menu
        items={[
            {
                key: '1',
                label: '超级管理员',
            },
            {
                key: '2',
                label: '退出',
                danger: true
            },
        ]}
    />
);



export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        setCollapsed(!collapsed)

    }
    return (
        <Header
            className="site-layout-background"
            style={{
                padding: "0, 16px"
            }}
        >
            {collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}

            <div style={{ float: "right" }}>
                <span>欢迎admin回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size='large' icon={<UserOutlined />}></Avatar>
                </Dropdown>
            </div>
        </Header>
    )
}
