import React, { useEffect, useState, useRef } from 'react'
import { Table, Tag, Button, Modal, Switch, Select } from 'antd'
import axios from 'axios';

import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal


export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [isUpdateVisible,setIsUpdateVisible] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [isUpdate,setIsUpdate]=useState(false)
  const [dialog, setDialog] = useState({visible:false,title:''})

  const addForm = useRef(null)
  const updateForm = useRef(null)

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (key) => {
        return <Tag color='orange'>{key}</Tag>
      }
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick></Button>
          <Button type="primary" shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={handleUpdate}></Button>
        </div>
      }
    },
  ];

  useEffect(() => {
    fetchData()
    getRegionList()
  }, [])

  

  const handleUpdate = (item)=>{
    setTimeout(()=>{
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        setIsUpdateDisabled(true)
      }
      else {
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    },0)
  }

  const upDateOK=()=>{

  }


//添加用户
  const handleAddUser = () => {
    setIsUpdate(false) 
    setDialog({visible:true,title:'添加用户'})
    getRegionList()
    getRoleList()
  }




  // const handleChange = (item)=>{
  //   // console.log(item)
  //   item.roleState = !item.roleState
  //   setDataSource([...dataSource])

  //   axios.patch('http://localhost:8000/users/item.id')

  // } 

  useEffect(() => {
    axios.get('http://localhost:8000/users?_embed=role').then(res => {
      const list = res.data
      setDataSource(list)
    }, [])
  })

  useEffect(() => {
    axios.get('http://localhost:8000/regions').then(res => {
      const list = res.data
      setRegionList(list)
    }, [])
  })

  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(res => {
      const list = res.data
      setRoleList(list)
    }, [])
  })




  return (
    <div>
      <Button type='primary' onClick={() => handleAddUser()} >添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} />

      <Modal
        open={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
          setIsUpdateDisabled(!setIsUpdateDisabled)
        }}
        onOk={() => {
          // console.log("add")
          addForm.current.validateFields().then(value => {
            console.log(value)
          }).catch(err => {
            console.log(err)
          })

        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false)
        }}
        onOk={() => {
          // console.log("add")
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={isUpdate}></UserForm>
      </Modal>

    </div>
  )
}
