import {UserOutlined, SettingOutlined, HomeOutlined} from '@ant-design/icons';
import {Menu, App} from 'antd';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type
    };
}

const BASE_URL = location.protocol + '//' + location.host;
const items = [
    getItem('Person', 'sub1', <UserOutlined />, [
        {
            label: (
                <a href={`${BASE_URL}/admin/person/all-list`} style={{textDecoration: "none"}} rel="noopener noreferrer">
                    All Person List
                </a>
            ),
            key: 'all_person_list',
        },
        {
            label: (
                <a href={`${BASE_URL}/admin/head-of-family/all-list`} style={{textDecoration: "none"}} rel="noopener noreferrer">
                    Head of Family List
                </a>
            ),
            key: 'head_of_family_list',
        },
    ]),{
        type: 'divider'
    },
    getItem('Families', 'sub2', <HomeOutlined />, [
        {
            label: (
                <a href={`${BASE_URL}/admin/gallery/list`} style={{textDecoration: "none"}} rel="noopener noreferrer">
                    Gallery List
                </a>
            ),
            key: 'gallery_list',
        },        
    ]),{
        type: 'divider'
    },
    getItem('Settings', 'sub4', <SettingOutlined/>, [
        getItem('Users', 'users'),
        {
            label: (
                <a style={{textDecoration: "none"}} rel="noopener noreferrer">
                    Logout
                </a>
            ),
            key: 'logout',
        },
    ]),
];
const SideBar = () => {
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
    };
    return (
        <Menu
            onClick={onClick}
            style={{
                height: '100%',
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}/>
    );
};
export default SideBar;