import { useState } from 'react';
import { Space, Table, Row, Col, Spin, Button, Breadcrumb } from 'antd';
import CompleteLayout from "../Layout/CompleteLayout"

import { useQuery } from "react-query";

import {HEAD_FAMILY_LIST_ADMIN_API} from "@api";

import { MutationFetch } from '../../Helpers/mutation'
import useHandleError from '../../Helpers/handleError'

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
        title: 'Total Members',
        dataIndex: 'total_member',
        key: 'total_member'
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

const AdminHeadFamilyList = () => {
    const [person, setPerson] = useState({});
    const [page, setPage] = useState(1);
    const { handleError } = useHandleError();

    const {isLoading} = useQuery({
        queryKey: ['fetchPersonList', page],
        queryFn: () =>
            MutationFetch(HEAD_FAMILY_LIST_ADMIN_API, {
                page: page,
                length: 10,
            }),
        onError: (error) => {
            handleError(error);
        },
        onSuccess: (response) => 
            setPerson(response.data.data),
    })

    if (isLoading) {
        return (
            <CompleteLayout>
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
            </CompleteLayout>
        )
    }

    return(
        <CompleteLayout>
            <div style={{textAlign:'right', padding:'0 20px 20px 0'}}>
                <Row>
                    <Col span={12}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Person</Breadcrumb.Item>
                            <Breadcrumb.Item>All Head of Family List</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={12}>
                        <Button type='primary' href={`${BASE_URL}/admin/add`}>Add Person</Button>
                    </Col>
                </Row>
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
        </CompleteLayout>
    )
};
export default AdminHeadFamilyList;