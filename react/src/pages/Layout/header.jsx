import { HomeOutlined, LogoutOutlined, UserOutlined, AppstoreOutlined, PictureOutlined } from '@ant-design/icons';
import { Menu, Button, App } from 'antd';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

import { HandleGetCookies } from '../Helpers/mutation'

const BASE_URL = location.protocol + '//' + location.host;
const userData = HandleGetCookies("userData", true);

let dropDownMenu = [
  {
    label: (
      <Button type="link" href={`${BASE_URL}/person/${userData.person_id}`} icon={<UserOutlined style={{verticalAlign: "baseline"}} />} style={{textDecoration: "none", color: "inherit"}} rel="noopener noreferrer">
        My Profile
      </Button>
    ),
    key: 'my_profile'
  },
  {
    label: (
      <Button type="link" href={`${BASE_URL}/person/${userData.person_id}`} icon={<PictureOutlined style={{verticalAlign: "baseline"}} />} style={{textDecoration: "none", color: "inherit"}} rel="noopener noreferrer">
        My Gallery
      </Button>
    ),
    key: 'my_gallery'
  },
  {
    label: (
      <Button type="link" icon={<LogoutOutlined style={{verticalAlign: "baseline"}} />} style={{textDecoration: "none", color: "inherit"}} rel="noopener noreferrer">
        Logout
      </Button>
    ),
    key: 'logout'
  },
]

if (userData) {
  if (userData.user_roles.some(val => val.role == "super_admin")) {
    let newDropdownMenu = [
      {
        label: (
          <Button type="link" href={`${BASE_URL}/admin/person/all-list`} icon={<AppstoreOutlined style={{verticalAlign: "baseline"}} />} style={{textDecoration: "none", color: "inherit"}} rel="noopener noreferrer">
            Admin Page
          </Button>
        ),
        key: 'admin_page'
      }, ...dropDownMenu
    ]
    dropDownMenu = newDropdownMenu
  } 
}

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
      <Button type="link" style={{textDecoration: "none", color: "inherit"}} rel="noopener noreferrer">
        <img src={userData.profile_pict} alt="user_profile_pict" style={{width: "25px", borderRadius: "100%"}} />
      </Button>
    ),
    key: 'profile_setting',
    children: dropDownMenu,
  },
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