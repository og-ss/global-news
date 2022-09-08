import React, { useEffect, useState } from 'react'
import { Table,Tag,Button, List } from 'antd'
import axios from 'axios';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    render:(id)=>{
      return<b>{id}</b>
    }
  },
  {
    title: '权限名称',
    dataIndex: 'title',
  },
  {
    title: '权限路径',
    dataIndex: 'key',
    render:(key)=>{
      return<Tag color='orange'>{key}</Tag>
    }
  },
  {
    title: '操作',
    render:()=>{
      return<div>
        <Button danger shape="circle" icon={<DeleteOutlined/>}></Button>
        <Button type="primary" shape='circle' icon={<EditOutlined/>}></Button>
      </div>
    }
  },
];
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      setDataSource(res.data)
    }, [])
  })
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  )
}
