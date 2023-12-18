import { useState } from 'react';
import { Space, Table, Row, Col, Spin, Button, Breadcrumb, Input,Tag } from 'antd';
import CompleteLayout from "../Layout/CompleteLayout"

import { useQuery } from "react-query";

import {PERSON_LIST_ADMIN_API} from "@api";

import { MutationFetch, HandleError } from '../../Helpers/mutation'

const { Search } = Input;

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
        title: 'Relation',
        dataIndex: 'relation',
        key: 'relation',
        render: (record, index) => {
            if (index.pid !== null) {
                return(
                    <Tag color="success">Have relation</Tag>
                )
            } else {
                return(
                    <Tag color="error">Does not Have relation</Tag>
                )
            }
        },
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: (record, index) => {
            return(
                <Space>
                    <Button type='primary' href={`${BASE_URL}/admin/person/relation/${index.id}`} ghost>Update Relation</Button>
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
    const [search, setSearch] = useState("");

    const {isLoading, refetch} = useQuery({
        queryKey: ['fetchPersonList', page],
        queryFn: () =>
            MutationFetch(PERSON_LIST_ADMIN_API, {
                search: search,
                page: page,
                length: 10,
            }),
        onError: (error) => {
            console.log(error.response.status)
            HandleError(error)
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
            <div style={{padding:'0 20px 20px 0'}}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Person</Breadcrumb.Item>
                    <Breadcrumb.Item>All Person List</Breadcrumb.Item>
                </Breadcrumb>
                <Row>
                    <Col span={12}>
                        <Search
                            placeholder="Search Persons"
                            value={search}
                            onChange={(e) => {setSearch(e.target.value)}}
                            onSearch={refetch}
                            style={{
                                width: 200,
                            }}
                        />
                    </Col>
                    <Col span={12} style={{textAlign:'right', }}>
                        <Button type='primary' href={`${BASE_URL}/admin/person/add`}>Add Person</Button>
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
export default AdminPersonList;