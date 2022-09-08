import React, { useEffect, useRef, useState } from 'react'
import { Button, PageHeader, Select, Steps, Form, Input, message } from 'antd'
import style from "./NewsAdd.module.css"
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import NewsEditor from '../../../components/news-manege/NewsEditor';

const { Step } = Steps;

const { Option } = Select;

const User = localStorage.getItem("token")
console.log("======>",User)

function NewsAdd(props) {
  const [current, setCurrent] = useState(0)

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
  const [categoryList, setCategoryList] = useState([])

  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")

  const NewsForm = useRef(null)

  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategoryList(res.data)
    })
  }, [])


  const handleSave =(auditState=0)=>{
    axios.post("/news",{
      ...formInfo,
      "content": "content",
      "region": User.region?User.region:"全球",
      "author": User.username,
      "roleId": User.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 0
    }).then(res=>{
      props.history.push(auditState===0?'/news-manage/draft':'/audit-manage/list')
    })
  }


  return (
    <div>
      <PageHeader
        className='s'
        title="撰写新闻"
        subTitle="This is a subtitle"
      />

      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ margin: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            {...layout}
            name="basic"
            ref={NewsForm}
          >
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                  message: '请输入',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="新闻分类"
              rules={[
                {
                  required: true,
                  message: '请输入',
                },
              ]}
            >
              <Select>
                {
                  categoryList.map(item =>
                    <Option value={item.id} key={item.id}>{item.title}</Option>
                  )
                }
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? "" : style.active}>
          <NewsEditor getContent={(value) => {
            console.log(value)
            setContent(value)
          }}></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}></div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={()=>handleSave()}>保存草稿箱</Button>
            <Button danger onClick={()=>handleSave()}>提交审核</Button>
          </span>
        }
        {
          current < 2 && <Button type='primary' onClick={() => {
            if (current === 0) {
              NewsForm.current.validateFields().then(res => {
                console.log(res)
                setFormInfo(res)
                setCurrent(current + 1)
              })
            }
            else {
              if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
              } else {
                setCurrent(current + 1)
              }
            }
          }}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={() => {
            setCurrent(current - 1)
          }}>上一步</Button>
        }
      </div>

    </div>
  )
}
export default withRouter(NewsAdd)