import {UserOutlined, SettingOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
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
    getItem('Settings', 'sub4', <SettingOutlined/>, [
        getItem('Users', 'users'),
    ]),
];
const SideBar = () => {
    const onClick = (e) => {
        console.log('click ', e);
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