import React, { forwardRef,useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const UserForm = forwardRef((props, ref) => {
    const [isDisabled,setIsDisabled] = useState(false)
    

    return (
        <Form
            ref={ref}
            layout="vertical"  //垂直布局
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                    ()=>({
                        validator(_,value){
                            if(value.replace(/[\u4e00-\u9fa5]/g, 'aa').length > 16 ){
                                return Promise.reject(new Error('不能超过16个字节'));
                            }
                            return Promise.resolve();
                        }
                    })
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        
                        required: true,
                        message: '请输入密码!',
                    },
                    ({getFieldValue})=>({
                        validator(_, value) {
                        //     console.log(_,value)
                        //     if (!value || getFieldValue('password') === value) {
                        //       return Promise.resolve();
                        //     }
                        //     return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        //   },

                          if (value.length > 20) {
                            return Promise.reject(new Error('不能超过20个字节'));
                          }
                          return Promise.resolve();
                        },
                    })
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={[
                    {
                        required: true,
                        message: '请选择区域',
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id}>{item.title}</Option>
                        )
                    }
                </Select>

            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请选则角色',
                    },
                ]}
            >
                <Select onChange={(value)=>{
                    console.log(value)
                    if(value === "1"){
                        setIsDisabled(true)
                        ref.current.setFieldsValue({
                            region:""
                        })
                    }else{
                        setIsDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.value} key={item.id}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>


        </Form>
    )
})
export default UserForm