import { Button, Form, Input, Row, Col, Typography, message } from 'antd';
import axios from 'axios';

import { PERSON_SEARCH_API } from '@api';

const { Title } = Typography;

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    
    const onFinish = (values) => {
        axios.post(PERSON_SEARCH_API, {
            'person_name': values['fullname']
        })
        .then(response => {
            window.location.href = `/dashboard/${response.data.data.id}`
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
                <Title level={2}>Search name</Title>
                <Form
                name="basic"
                style={{
                    maxWidth: 600,
                }}
                onFinish={onFinish}
                autoComplete="off"
                >
                    <Form.Item
                        label="Full Name"
                        name="fullname"
                        rules={[
                        {
                            required: true,
                            message: 'Please input the name!',
                        },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                
                    <Form.Item
                        wrapperCol={{
                        offset: 8,
                        span: 16,
                        }}
                    >
                        <Button type="primary" style={{float: 'right'}} htmlType="submit">
                            Show Family
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
      );
}
    
export default Login;