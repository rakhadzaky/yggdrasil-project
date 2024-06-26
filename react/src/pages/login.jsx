import { Button, Row, Col, Typography, App, Space, Modal, Input } from 'antd';
import { GoogleOutlined, SmileOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

// Bring in the GoogleLogin component from the library
import {useGoogleLogin } from '@react-oauth/google';

import { LOGIN_API, GUEST_CHECK } from '@api';

const { Title } = Typography;

const Login = () => {
    const [guestCode, setGuestCode] = useState("");
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        loginGuest()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    const loginApp = (accessToken) => {
        axios.post(LOGIN_API, {
            'access_token': accessToken,
        })
        .then(response => {
            message.open({
                key: "login_message",
                type: 'success',
                content: 'Loaded!',
                duration: 2,
            });

            // store jwt token
            let currDate = new Date()
            let authorisationData = {
                ...response.data.authorisation,
                "exp_time": currDate.setTime(currDate.getTime() + 3 * 60 * 60 * 1000), // Add expire time 3 hour
            }
            Cookies.set('token', JSON.stringify(authorisationData), { secure: true });
            // set default header authorization to jwt
            axios.defaults.headers.common['Authorization'] = response.data.authorisation.type + " " + response.data.authorisation.token;

            // map user roles data
            let userRoles = []
            response.data.user.roles_user.map((value) => {
                userRoles.push({"role" : value.role.role})
            })
            // store user data
            let userData = {
                "name": response.data.user.name,
                "email": response.data.user.email,
                "profile_pict": response.data.user.profile_pict,
                "user_roles": userRoles,
            }
            Cookies.set('userData', JSON.stringify(userData), { secure: true });

            if (response.data.user.person === null) {
                // if data person doesn't exists bring the user to pre dashboard page
                navigate(`pre/dashboard`)
            } else {
                // if data person exist then save the cookie and continue to dashboard family tree

                // add person id data to user data, then restore the user data
                userData = {
                    "person_id": response.data.user.person.id,
                    ...userData,
                }
                Cookies.set('userData', JSON.stringify(userData), { secure: true });
                navigate(`/dashboard`)
            }
        })
        .catch(error => {
            message.open({
                key: "login_message",
                type: 'error',
                content: error.response.data.message,
            });
        });
    };

    const loginAction = () => {
        setIsLoginLoading(true)
        loginGoogleButton()
    }

    const loginGuest = () => {
        axios.post(GUEST_CHECK, {
            'guest_code': guestCode,
        })
        .then(() => {
            message.open({
                key: "login_message",
                type: 'success',
                content: 'Loaded!',
                duration: 2,
            });

            // store jwt token
            let currDate = new Date()
            let authorisationData = {
                "guest_code": guestCode,
                "exp_time": currDate.setTime(currDate.getTime() + 3 * 60 * 60 * 1000), // Add expire time 3 hour
            }
            Cookies.set('token', JSON.stringify(authorisationData), { secure: true });

            navigate(`/guest/person/family-tree`)
        })
        .catch(error => {
            message.open({
                key: "login_message",
                type: 'error',
                content: error.response.data.message.guest_code[0],
            });
        });
    }

    const loginGoogleButton = useGoogleLogin({
        onSuccess: codeResponse => {
            message.open({
                key: "login_message",
                type: "loading",
                content: "Login success, Redirecting..."
            });
            loginApp(codeResponse.access_token)
        }
    });

    return (
        <>
            <Row align="middle" style={{minHeight: '100vh'}}>
                {/* {contextHolder} */}
                <Col span={8} offset={8} style={{textAlign: "center"}}>
                    <Title level={2}>Login</Title>
                    <Space size={'middle'}>
                        <Button onClick={() => loginAction()} type="primary" shape="round" icon={<GoogleOutlined style={{verticalAlign: "unset"}} />} size={"large"} loading={isLoginLoading}>
                            Log In Using Google
                        </Button>
                        <Button onClick={() => showModal()} type="primary" shape="round" icon={<SmileOutlined style={{verticalAlign: "unset"}} />} size={"large"} loading={isLoginLoading} ghost>
                            View as Guest
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Modal title="Input your guest code" open={isModalOpen} onOk={() => handleOk(guestCode)} onCancel={handleCancel}>
                <Input placeholder="Guest Code" onChange={(e) => setGuestCode(e.target.value)} />
            </Modal>
        </>
    );
}

export default Login;