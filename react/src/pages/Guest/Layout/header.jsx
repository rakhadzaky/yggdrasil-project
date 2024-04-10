import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { Menu, App } from 'antd';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const BASE_URL = location.protocol + '//' + location.host;

const items = [
  {
    label: (
      <a href={`${BASE_URL}/dashboard`} style={{textDecoration: "none"}} rel="noopener noreferrer">
        Family Tree
      </a>
    ),
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: (
      <a href={`${BASE_URL}`} style={{textDecoration: "none"}} rel="noopener noreferrer">
        Login
      </a>
    ),
    key: 'login',
    icon: <LoginOutlined />,
  }
];

const HeaderBar = () => {
    const [current, setCurrent] = useState('mail');
    const navigate = useNavigate();
    const { message } = App.useApp()

    const logout = () => {
      Cookies.remove('token');
      Cookies.remove('userData');

      message.success("Logout success");
      navigate("/")
    }

    const onClick = (e) => {
        if (e.key == "logout") {
          logout()
        }
        setCurrent(e.key);
    };

    return (
        <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{justifyContent: 'flex-start'}} />
        </>
    );
};
export default HeaderBar;