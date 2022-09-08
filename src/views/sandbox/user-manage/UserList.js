import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios'
import { Table,  Space, Button ,Modal,Switch} from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;


function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [dialog, setdialog] = useState({visible:false,title:''})
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [isUpdate,setisUpdate]=useState(false)
  const curUserForm=useRef(null)
  
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value:item.value
        })),
        {
          text: '全球',
          value:''
        }
      ],
      filterSearch: true,
      onFilter: (value, record) => record.region===value,
      render: (region) => <b> {region === '' ? '全球' : region}</b>,
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => role.roleName,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState,item) => <Switch  checked={roleState} disabled={item.default} onChange={ ()=>handleChangeState(item)}/>,
    },
    {
      title: '操作',
      render: (item) =>
        <Space>
          <Button danger shape="circle" ghost icon={<DeleteOutlined />}  disabled={item.default}  onClick={() => handleDelete(item)}></Button>
          <Button type="primary" shape="circle" ghost icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)}></Button>
        </Space>,
    },
  ]

  const { roleId, region,username } = JSON.parse(localStorage.getItem('token'))
  //通过数组映射可以更直观的知道当前的用户角色
  const roleObj = {
    "1": 'superadmin',
    "2": 'admin',
    "3":'editor'
  }
  useEffect(() => {
    fetchData()
    getRegionList()
  }, [])

  const fetchData = () => {
    axios.get('/users?_expand=role').then(response => {
      const list = response.data
      //如果是超级管理员roleId===1，获取所有的数据列表，如果不是，只能获取当前自己的角色列表以及同一个区域下的区域编辑用户
      setdataSource(roleObj[roleId] === "superadmin" ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item=>item.region===region&& roleObj[item.roleId]==='editor')
      ])
    })
  }
  //获取角色列表数据
  const getRoleList = async () => {
    await axios.get('http://localhost:8000/roles').then(response => {
      const list = response.data
      setroleList(list)
      console.log(list)
    })
  }

  const getRegionList = async () => {
    await axios.get('http://localhost:8000/regions').then(response => {
      const list = response.data
      setregionList(list)
    })
  }

  //删除
  const handleDelete = (item) => {
    confirm({
      title: '您确定要删除此项数据吗?',
      icon: <ExclamationCircleOutlined />,
      okText:"确认",
      cancelText: "取消",
      
      onOk() {
        confirmDelete(item)
      },
      onCancel() {

      },
    });
  }
  //更新
  const handleUpdate = (item) => {
    setisUpdate(true)
    getRegionList()
    getRoleList()
    setTimeout(() => {
      setdialog({ visible: true, title: '更新用户' })
      //超级管理员，禁用
      if (item.roleId === 1) {
        setisUpdateDisabled(true)
      }
      else {
        setisUpdateDisabled(false)
      }
      curUserForm.current.setFieldsValue(item)
    },0)
  }
  //确认删除
  const confirmDelete = (item) => { 
    // 当前页面同步状态+后端同步
    // setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`).then(() => {
      fetchData()  //删除完数据后，重新调用刷新数据的接口，更新数据
    })
  }

  //切换用户状态
  const handleChangeState = (item) => {
    item.roleState=!item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState:item.roleState
    })
  }

  //添加用户
  const handleAddUser = () => {
    setisUpdate(false) 
    setdialog({visible:true,title:'添加用户'})
    getRegionList()
    getRoleList()
  }

  //提交表单
  const handleSubmit = () => {
    const id = curUserForm.current.getFieldValue().id;
    console.log("curUserForm.current.getFieldValue():",curUserForm.current.getFieldValue())
    curUserForm.current.validateFields().then(value => {
      setdialog({visible:false,title:''})
      resetForm()
      // setdataSource([...dataSource,{res}]) id怎么设置？
      // post到后端，生成id,再设置dataSoure,方便后面的删除和更新
      // 添加
      if (id === undefined) {
        axios.post('http://localhost:8000/users', { ...value, 'roleState': true, 'default': false }).then(res => {
          setdataSource([...dataSource,
            {
              ...res.data,
              role: roleList.filter(item => item.id == value.roleId)[0]
            }])
        })
      }
      //更新
      else {
        axios.patch(`http://localhost:8000/users/${id}`, { ...value }).then(res => {
        setdataSource(
          dataSource.map(item => {
            if (item.id === id) {
              console.log("item:",item)
              return {
                ...item,
                ...value,
                role: roleList.filter(item => item.id === value.roleId)[0]
              }
            } else {
              return item
            }
          })
        )
        })

        
      }
      }).catch(err => {})
  }

  //重置表单
  const resetForm = () => {
    curUserForm.current.resetFields()
  }

  return (
    <div>
      <Button type='primary' style={{marginBottom:'10px'}} onClick={()=>handleAddUser()}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
        pageSize: 5,
        }}
        rowKey={item=>item.id}/>
      <Modal
        open={dialog.visible}
        title={dialog.title}
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setdialog({ visible: false, title: '' })
          setisUpdateDisabled(false)
          resetForm()
        }
        }
        onOk={()=>handleSubmit()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={curUserForm} isUpdateDisabled={isUpdateDisabled} isUpdate={isUpdate}></UserForm>
      </Modal>
    </div>
  )
}

export default UserList