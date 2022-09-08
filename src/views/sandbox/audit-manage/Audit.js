import axios from 'axios'
import React from 'react'
import { useState,useEffect} from 'react'
import { Table,Button,Space,notification} from 'antd'
import { CheckOutlined,CloseOutlined } from '@ant-design/icons';


function AuditNews() {
  const { roleId, region,username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource,setdataSource]=useState([])
  
  const roleObj = {
    "1": 'superadmin',
    "2": 'admin',
    "3":'editor'
  }

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      // 跳转至预览页面
      render: (title,item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>, 
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title,
    },
    {
      title: '操作',
      render: (item) => 
      <div>
        <Space>
          <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={()=>handleAudit(item,2,1)}></Button>
          <Button danger type="primary" shape="circle" icon={<CloseOutlined />} onClick={()=>handleAudit(item,3,0)}></Button>
        </Space>
     </div>
     },
  ]

  useEffect(()=>{
    getCurAuditNews()
  },[])
  
  // 获取当前的新闻审核列表
  // auditState=1：审核中
  const getCurAuditNews=()=>{
    axios.get(`/news?auditState=1&_expand=category`).then(response=>{
      const list=response.data
       //如果是超级管理员roleId===1，获取所有的数据列表，如果不是，只能获取当前自己的角色列表以及同一个区域下的区域编辑用户
       setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item=>item.region===region&& roleObj[item.roleId]==='editor')
      ])
    })
  }
  
  //审核新闻
  const handleAudit=(item,auditState,publishState)=>{
    setdataSource(dataSource.filter(data=>data.id!==item.id))
    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState,
    }).then(()=>{
      notification.info({
        message: '通知',
        description: `您可以到审核列表中查看新闻`,
        placement:'bottomRight'
      });
    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
      pagination={{
      pageSize: 5,
      }}
      rowKey={item=>item.id}/>
    </div>
  )
}

export default AuditNews