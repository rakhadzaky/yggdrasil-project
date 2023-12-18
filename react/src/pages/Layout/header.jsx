import { HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';

const BASE_URL = location.protocol + '//' + location.host;
const items = [
    {
      label: (
        <a href={`${BASE_URL}`} style={{textDecoration: "none"}} rel="noopener noreferrer">
          Home
        </a>
      ),
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: (
        <a href={`${BASE_URL}`} style={{textDecoration: "none"}} rel="noopener noreferrer">
          Logout
        </a>
      ),
      key: 'logout',
      icon: <LogoutOutlined />,
    }
  ];

const HeaderBar = () => {
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{justifyContent: 'flex-start'}} />
        </>
    );
};
export default HeaderBar;