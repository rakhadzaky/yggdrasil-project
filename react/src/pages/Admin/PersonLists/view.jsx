import { useState } from 'react';
import axios from 'axios';
import { Space, Table, Divider, Row, Col, Spin, message, Button } from 'antd';
import Header from "../Layout/header"
import FooterBar from "../Layout/footer"

import { useQuery } from "react-query";

import {PERSON_LIST_ADMIN_API} from "@api";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'live_loc',
        key: 'live_loc',
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: () => {
            return(
                <Space>
                    <Button type='primary' ghost>Edit</Button>
                    <Button danger>Delete</Button>
                </Space>
            )
        }
    }
];

const BASE_URL = location.protocol + '//' + location.host;

const AdminPersonList = () => {
    const [person, setPerson] = useState({});
    const [page, setPage] = useState(1);

    const [messageApi] = message.useMessage();

    const {isLoading} = useQuery({
        queryKey: ['fetchPersonList', page],
        queryFn: () =>
            axios.get(PERSON_LIST_ADMIN_API, {
                page: page,
                length: 10,
            }),
        onError: (error) => {
            console.log(error)
            messageApi.open({
                type: 'error',
                content: 'This is an error message',
            });
        },
        onSuccess: (response) => 
            setPerson(response.data.data),
    })

    if (isLoading) {
        return (
            <>
                <Header />
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
                <FooterBar />
            </>
        )
    }

    return(
        <>
        <Header />
        <Row style={{minHeight: '90vh', padding: '60px 0'}}>
            <Col span={16} offset={4}>
                <Divider orientation="left">
                    Person List
                </Divider>
                <div style={{textAlign:'right', padding:'0 20px 20px 0'}}>
                    <Button type='primary' href={`${BASE_URL}/admin/add`}>Add Person</Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={person}
                    pagination={{
                        page: person.page,
                        total: person.total,
                        onChange: (page) => {
                            setPage(page)
                        }
                    }}
                    size="middle"
                    scroll={{ x: 'calc(700px + 50%)' }}
                />
            </Col>
        </Row>
        <FooterBar />
        </>
    )
};
export default AdminPersonList;