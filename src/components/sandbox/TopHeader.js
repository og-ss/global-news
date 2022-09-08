import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar, } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';

const { Header } = Layout;


function TopHeader(props) {
    const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        setCollapsed(!collapsed)

    }

    const menu = (
        <Menu
            onClick={()=>{
                localStorage.removeItem("token")
                props.history.replace("/login")
            }} 
            items={[
                {
                    key: '1',
                    label: '超级管理员',
                    disabled:true
                },
                {
                    key: '2',
                    label: '退出',
                    danger: true
                },
            ]}
        />
    );
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
export default withRouter(TopHeader)
