import { AppstoreOutlined, ApartmentOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { HandleGetCookies } from '../../Helpers/mutation'

const BASE_URL = location.protocol + '//' + location.host;
const userData = HandleGetCookies("userData", true);

const items = [
    {
      label: (
        <a href={`${BASE_URL}/dashboard/${userData.person_id}`} style={{textDecoration: "none"}} rel="noopener noreferrer"></a>
      ),
      key: 'family_tree',
      icon: <ApartmentOutlined />,
    },
    {
      label: (
        <a href={`${BASE_URL}/admin/person/all-list`} style={{textDecoration: "none"}} rel="noopener noreferrer">
          Dashboard Admin
        </a>
      ),
      key: 'dashboard_admin',
      icon: <AppstoreOutlined />,
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
            <Menu onClick={onClick} defaultSelectedKeys={['dashboard_admin']} theme='dark' selectedKeys={[current]} mode="horizontal" items={items} />
        </>
    );
};
export default HeaderBar;