import { Button, Row, Col, Typography, App } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

// Bring in the GoogleLogin component from the library
import {useGoogleLogin } from '@react-oauth/google';

import { LOGIN_API } from '@api';

const { Title } = Typography;

const Login = () => {
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp()
    
    const loginApp = (accessToken) => {
        axios.post(LOGIN_API, {
            'access_token': accessToken,
        })
        .then(response => {
            navigate(`/dashboard/${response.data.user.person.id}`)
            // store jwt token
            let currDate = new Date()
            let authorisationData = {
                ...response.data.authorisation,
                "exp_time": currDate.setTime(currDate.getTime() + 3 * 60 * 60 * 1000), // Add expire time 3 hour
                "pid": response.data.user.person.id
            }
            axios.defaults.headers.common['Authorization'] = response.data.authorisation.type + " " + response.data.authorisation.token;
            Cookies.set('token', JSON.stringify(authorisationData), { secure: true });

            // store user data
            let userData = {
                "person_id": response.data.user.person.id,
                "name": response.data.user.name,
                "email": response.data.user.email,
                "profile_pict": response.data.user.profile_pict,
            }
            Cookies.set('userData', JSON.stringify(userData), { secure: true });
        })
        .catch(error => {
            message.open({
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
            {/* {contextHolder} */}
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