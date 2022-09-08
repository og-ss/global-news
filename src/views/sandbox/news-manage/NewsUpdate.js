import style from './index.module.css'
import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd';
import NewsEditor from '../../../components/news-manege/NewsEditor'
import axios from 'axios';
import { useParams,withRouter } from 'react-router-dom'
const { Step } = Steps;
const { Option } = Select;


function Update(props) {
    const [currentStep, setcurrentStep] = useState(0)
    const [categoryList, setcategoryList] = useState([])
    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")

    const curId = useParams().id

    //下一步
    const handleNext = () => {
        //第0步的时候：
        if (!currentStep) {
            //点击下一步之前先校验
            NewsForm.current.validateFields().then(value => {
                setcurrentStep(currentStep + 1)
                setformInfo(value) //保存新闻的标题、类别信息
            }).catch(error => {

            })
        } else {
            //后续步骤
            if (content === "" || content.trim() === '<p></p>') {
                message.error('新闻内容不能为空!');
            } else {
                setcurrentStep(currentStep + 1)
            }
        }
    }
    //上一步
    const handlePrev = () => {
        setcurrentStep(currentStep - 1)
    }
    const NewsForm = useRef(null)

    useEffect(() => {
        getCategory()
        getCurNews()
    }, [])

    //获取新闻类别
    const getCategory = () => {
        axios.get('/categories').then(response => {
            setcategoryList(response.data)
        })
    }
    //获取当前的新闻
    const getCurNews = () => {
        axios.get(`/news/${curId}?_expand=category&_expand=role`).then(response => {
            const { title, categoryId, content } = response.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId,
            })
            setContent(content)
        })
    }
    //保存至草稿箱
    const handleSave = (auditState) => {
        axios.patch(`/news/${curId}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            //编辑完成后跳转至草稿箱或审核新闻页面
            //1：审核，0 草稿
            props.history.push(auditState ? '/audit-manage/audit' : '/news-manage/draft', {})
            notification.info({
                message: '通知',
                description: `您可以到${auditState ? '审核列表' : '草稿箱'}中查看您编辑的新闻。`,
                placement: 'bottomRight'
            });
        })
    }

    return (
        <div>
            <PageHeader
                title="更新新闻"
                onBack={() => window.history.back()}
            />
            <Steps current={currentStep}>
                <Step title="基本信息" description="新闻标题，新闻类别" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或提交审核" />
            </Steps>
            <div style={{ marginTop: '50px' }}>
                <div className={currentStep === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        autoComplete="off"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: '请输入新闻标题!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻类别"
                            name="categoryId"
                            rules={[{ required: true, message: '请选择新闻类别' }]}>
                            <Select
                                placeholder="请选择新闻类别"
                                allowClear>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </div>

                <div className={currentStep === 1 ? '' : style.active}>
                    {/* 保存新闻内容 */}
                    <NewsEditor getContent={(value) => {
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={currentStep === 2 ? '' : style.active}>
                    333
                </div>
            </div>

            <div style={{ marginTop: '50px' }} >
                {
                    currentStep === 2 &&
                    <span style={{ marginRight: '20px' }}>
                        <Button type='primary' style={{ marginRight: '20px' }} onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    currentStep < 2 && <Button type="primary" style={{ marginRight: '20px' }} onClick={handleNext}>下一步</Button>
                }
                {
                    currentStep > 0 && <Button onClick={handlePrev} >上一步</Button>
                }

            </div>
        </div>
    )
}

export default withRouter(Update)