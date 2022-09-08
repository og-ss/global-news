import axios from 'axios'
import React,{ useEffect,useState } from 'react'
import { Table, Tag, Button,notification} from 'antd'

function AuditList(props) {
    const {username} =JSON.parse(localStorage.getItem('token'))
    const [dataSource, setdataSource] = useState([])
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
        title: '审核状态',
        dataIndex: 'auditState',
        render: (auditState) =>{
          const colorList=['','orange','green','red']
          const auditList=['草稿箱','审核中','已审核','未通过']
          return <Tag color={colorList[Number(auditState)]}>{auditList[Number(auditState)]}</Tag>
        }
      },
      {
        title: '操作',
        render: (item) => 
        <div>
          {
            // 审核中
            item.auditState===1 &&<Button onClick={()=>hanleRervert(item)}>撤销</Button>
          }
          {
            // 已审核
            item.auditState===2 &&<Button danger ghost onClick={()=>handlePublish(item)}>发布</Button>
          }
          {
            // 未通过
            item.auditState===3 &&<Button type="primary" ghost onClick={()=>handleUpdate(item)}>更新</Button>
          }
          
        </div>
      },
    ]
    useEffect(()=>{
      getAuditList()
    },[])
    //publishState: 未发布(0)、待发布(1)、已发布（2）
    
    //获取当前的审核列表:只获取审核状态为auditState:审核中(1),已通过(2),未通过(3)且发布状态为未发布(0)、待发布(1)
    const getAuditList=()=>{
      // _ne :!==的意思 ，_lte:<= 的意思 
      axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(response=>{
        setdataSource(response.data)
        console.log("=====>",response.data)
      })
    }
    
    //撤销
    const hanleRervert=(item)=>{
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.patch(`/news/${item.id}`,{
        auditState:0
      }).then(()=>{
        notification.info({
          message: '通知',
          description: '您可以到草稿箱中查看您编辑的新闻',
          placement:'bottomRight'
        });
      })
    }

    // 发布
    const handlePublish=(item)=>{
      setdataSource(dataSource.filter(data=>data.id!==item.id))
      axios.patch(`/news/${item.id}`,{
        publishState: 2, 
        publishTime: Date.now() 
      }).then(()=>{
        //跳转到已发布页面
        props.history.push(`/publish-manage/published`,{})
        notification.info({
          message: '通知',
          description: '您可以到[发布管理-已发布]中查看您编辑的新闻',
          placement:'bottomRight'
        });
      }) 
    }

    //更新
    const handleUpdate=(item)=>{
      props.history.push(`/news-manage/update/${item.id}`)
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

export default AuditList
