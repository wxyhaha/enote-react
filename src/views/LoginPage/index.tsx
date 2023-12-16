import './index.scss'
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import {useNavigate} from 'react-router-dom'
import Auth from '../../api/auth'

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

type FieldType = {
    username?: string;
    password?: string;
};

const LoginPage:React.FC=()=>{
    const navigate = useNavigate()

    const onFinish = (values: {username:string,password:string}) => {
        Auth.login(values).then(res=>{
            console.log('res',res)
            if(res.msg==='登录成功'){
                sessionStorage.setItem('userName',values.username)
                message.success('登录成功');
                navigate('/mainPage')
            }else {
                message.error(res.msg);
            }
        })
    };

    return (
        <div className='loginPage'>
            <div className='loginForm'>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 32 }}
                    style={{ maxWidth: 800 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    size='large'
                >
                    <Form.Item<FieldType>
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage