import { Button, Form, Input, Row, Col, Typography, message } from 'antd';
import axios from 'axios';

import { LOGIN_API } from '@api';

const { Title } = Typography;

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    
    const onFinish = (values) => {
        axios.post(LOGIN_API, {
            'email': values['email'],
            'password': values['password']
        })
        .then(response => {
            window.location.href = `/dashboard/${response.data.user.id}`
            let currDate = new Date()
            let authorisationData = {
                ...response.data.authorisation,
                "exp_time": currDate.setTime(currDate.getTime() + 3 * 60 * 60 * 1000) // Add expire time 3 hour
            }
            axios.defaults.headers.common['Authorization'] = response.data.authorisation.type + " " + response.data.authorisation.token;
            localStorage.setItem('token', JSON.stringify(authorisationData))
        })
        .catch(error => {
            messageApi.open({
                type: 'error',
                content: error.response.data.message,
            });
        });
    };

    return (
        <Row align="middle" style={{minHeight: '100vh'}}>
            {contextHolder}
            <Col span={8} offset={8}>
                <Title level={2}>Login</Title>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the password!',
                            },
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                
                    <Form.Item
                        wrapperCol={{
                        offset: 8,
                        span: 16,
                        }}
                    >
                        <Button type="primary" style={{float: 'right'}} htmlType="submit">
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
      );
}
    
export default Login;