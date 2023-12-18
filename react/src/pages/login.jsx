import { Button, Row, Col, Typography, message } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from 'react';

// Bring in the GoogleLogin component from the library
import {useGoogleLogin } from '@react-oauth/google';

import { LOGIN_API } from '@api';

const { Title } = Typography;

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    
    const loginApp = (accessToken) => {
        axios.post(LOGIN_API, {
            'access_token': accessToken,
        })
        .then(response => {
            window.location.href = `/dashboard/${response.data.user.person.id}`
            let currDate = new Date()
            let authorisationData = {
                ...response.data.authorisation,
                "exp_time": currDate.setTime(currDate.getTime() + 3 * 60 * 60 * 1000), // Add expire time 3 hour
                "pid": response.data.user.person.id
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

    const loginAction = () => {
        setIsLoginLoading(true)
        loginGoogleButton()
    }

    const loginGoogleButton = useGoogleLogin({
        onSuccess: codeResponse => {
            loginApp(codeResponse.access_token)
        }
    });

    return (
        <Row align="middle" style={{minHeight: '100vh'}}>
            {contextHolder}
            <Col span={8} offset={8} style={{textAlign: "center"}}>
                <Title level={2}>Login</Title>
                <Button onClick={() => loginAction()} type="primary" shape="round" icon={<GoogleOutlined style={{verticalAlign: "unset"}} />} size={"large"} loading={isLoginLoading}>
                    Log In Using Google
                </Button>
            </Col>
        </Row>
    );
}

export default Login;