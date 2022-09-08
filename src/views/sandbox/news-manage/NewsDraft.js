import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Table,  Space, Button ,Modal} from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined,UploadOutlined} from '@ant-design/icons';
import { withRouter} from 'react-router-dom';
const { confirm } = Modal;


function Draft(props) {
  const [dataSource, setdataSource] = useState([])
  const {username } = JSON.parse(localStorage.getItem('token'))
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (region) => <b> {region === '' ? '全球' : region}</b>,
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title,item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => category.title,
    },
    {
      title: '操作',
      render: (item) =>
        <Space>
          <Button danger shape="circle" ghost icon={<DeleteOutlined />}    onClick={() => handleDelete(item)}></Button>
          <Button type="primary" shape="circle" ghost icon={<EditOutlined />}  onClick={() => handleUpdate(item)}></Button>
          <Button  type="primary" shape="circle" ghost icon={<UploadOutlined />}  onClick={() => handleUpload(item)}></Button>
        </Space>,
    },
  ]

  useEffect(() => {
      axios.get(`/news?auditState=0&_expand=category`).then(response => {
      const list = response.data
      setdataSource(list) 
    })
  }, [username])

  const fetchData = () => {
    axios.get(`/news?&auditState=0&_expand=category`).then(response => {
      const list = response.data
      setdataSource(list) 
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

    props.history.push(`/news-manage/update/${item.id}`,{
      replace:false,
      state:{
        id:item.id,
      }
    })
  }

  //发布审核
  const handleUpload = (item) => {
    axios.patch(`/news/${item.id}`,{
      auditState:1
    }).then(response=>{
      props.history.push('/audit-manage/list',{})
    })
  }

  const confirmDelete = (item) => { 
    // 当前页面同步状态+后端同步
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`).then(() => {
      fetchData()  //删除完数据后，重新调用刷新数据的接口，更新数据
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

export default withRouter(Draft)