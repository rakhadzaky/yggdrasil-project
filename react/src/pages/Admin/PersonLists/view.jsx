import { useState } from 'react';
import { Space, Table, Row, Col, Spin, Button, Breadcrumb, Input, Tag, Select, App, Dropdown, Modal } from 'antd';
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import CompleteLayout from "../Layout/CompleteLayout"

import { useQuery } from "react-query";

import {PERSON_LIST_ADMIN_API, PERSON_FAMILY_LIST_ADMIN_API, PERSON_DELETE_ADMIN_API, ADMIN_CREATE_REFERRAL_API} from "@api";

import { MutationFetch, MutationSubmit } from '../../Helpers/mutation'
import useHandleError from '../../Helpers/handleError'

import { HandleGetCookies } from '../../Helpers/mutation'

const { Search } = Input;

const BASE_URL = location.protocol + '//' + location.host;

const AdminPersonList = () => {
    const [person, setPerson] = useState({});
    const [familyList, setFamilyList] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [familyId, setFamilyId] = useState();
    const [tableLoading, setTableLoading] = useState(false);
    const [initiateLoading, setInitiateLoading] = useState(true);
    const [isModalReferralOpen, setIsModalReferralOpen] = useState(false);
    const [referralRequest, setReferralRequest] = useState({
        submited_person_id: 0,
        sent_to_email: "",
    });

    const { handleError } = useHandleError();
    const { message } = App.useApp()
    const { confirm } = Modal;

    const userData = HandleGetCookies("userData", true);
    const userPID = userData.person_id;

    const {isLoading, refetch} = useQuery({
        queryKey: ['fetchPersonList', page, familyId],
        queryFn: () =>
            MutationFetch(PERSON_LIST_ADMIN_API, {
                search: search,
                page: page,
                length: 10,
                family_id: familyId
            }).then(response => {
                setPerson(response.data.data)
                setTableLoading(false)
                setInitiateLoading(false)
            })
            .catch(error => {
                handleError(error);
                setTableLoading(false);
                setInitiateLoading(false);
            })
    })

    const {isLoading: isLoadingFamilyList} = useQuery({
        queryKey: ['fetchFamilyList', page, familyId],
        queryFn: () =>
            MutationFetch(`${PERSON_FAMILY_LIST_ADMIN_API}/${userPID}`)
            .then(response => {
                setFamilyList(response.data.data)
                setFamilyId(response.data.data[0].id)
                setTableLoading(false)
                setInitiateLoading(false)
            })
            .catch(error => {
                handleError(error);
                setTableLoading(false);
                setInitiateLoading(false);
            })
    })

    const searchData = () => {
        setTableLoading(true)
        refetch()
    }

    const handleChangeFamily = (value) => {
        setTableLoading(true)
        setFamilyId(value);
        refetch()
    }

    const handleDeletePerson = (id) => {
        setTableLoading(true)

        // prepare data to be deleted
        let bodyData = {
            "id": [id]
        }

        MutationSubmit('post', `${PERSON_DELETE_ADMIN_API}`, bodyData, false)
            .then(() => {
                message.open({
                    type: 'success',
                    content: 'Update data success',
                    duration: 2,
                })
                setTableLoading(false)
                refetch
            })
            .catch(error => {
                setTableLoading(false)
                handleError(error)
            });
    }

    const handleSendReferral = () => {
        setTableLoading(true)

        // validate data, must exists
        if (referralRequest.submited_person_id == 0) {
            message.open({
                type: 'error',
                content: 'No person data selected',
            })
        }
        if (referralRequest.sent_to_email == "") {
            message.open({
                type: 'error',
                content: 'No email inserted',
            })
        }

        MutationSubmit('post', `${ADMIN_CREATE_REFERRAL_API}`, referralRequest, false)
            .then(() => {
                message.open({
                    type: 'success',
                    content: 'Email sent',
                    duration: 2,
                })
                setTableLoading(false)
                refetch
            })
            .catch(error => {
                setTableLoading(false)
                handleError(error)
            });
    }

    const handleOpenModalDelete = (e, index) => {
        confirm({
            title: 'Are you sure to delete this person?',
            icon: <ExclamationCircleFilled />,
            content: 'It will delete for good',
            onOk() {
                handleDeletePerson(index)
            },
        });
    }

    const handleCancelModalReferral = () => {
        setReferralRequest(
            {
                submited_person_id: 0,
                sent_to_email: "",
            }
        )
        setIsModalReferralOpen(false);
    }

    const handleSubmitModalReferral = () => {
        handleSendReferral();
        setIsModalReferralOpen(false);
    }

    const handleOnChangeEmailReferral = (e) => {
        // referralRequest.sent_to_email = e.target.value;
        setReferralRequest({
            ...referralRequest,
            sent_to_email: e.target.value
        })
    }

    const handleDropdownItemClick = (e) => {
        const keySplit = e.key.split("-");
        switch (keySplit[0]) {
            case 'update_relation':
                window.location.href = `${BASE_URL}/admin/person/relation/${keySplit[1]}`;
                break;
            case 'edit_person':
                window.location.href = `${BASE_URL}/admin/person/edit/${keySplit[1]}`;
                break;
            case 'send_referral_code':
                setIsModalReferralOpen(true);
                referralRequest.submited_person_id = keySplit[1];
                break;
            case 'delete_person':
                handleOpenModalDelete(e, keySplit[1])
                break;
        
            default:
                break;
        }
    };

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
            title: 'User',
            dataIndex: 'user_id',
            key: 'user_id',
            render: (record, index) => {
                if (index.user_id !== null) {
                    return(
                        <Tag color="success">Connected to User</Tag>
                    )
                } else {
                    return(
                        <Tag color="error">Not Connected to User</Tag>
                    )
                }
            },
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (record, index) => {
                const items = [
                    {
                        key: `update_relation-${index.id}`,
                        label: 'Update Relation',
                    },
                    {
                        key: `edit_person-${index.id}`,
                        label: 'Edit Person',
                    },
                    {
                        key: `send_referral_code-${index.id}`,
                        label: 'Send Referral Code',
                        disabled: index.user_id != null,
                    },
                    {
                        key: `delete_person-${index.id}`,
                        label: 'Delete Person',
                    },
                ];
                return(
                    <Space>
                        <Dropdown
                            trigger={['click']}
                            menu={{
                                onClick: handleDropdownItemClick,
                                items
                            }}
                            >
                            <a style={{'textDecoration' : 'none', 'color' : '#808080'}}>
                                Action <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                )
            }
        }
    ];

    if (initiateLoading || isLoadingFamilyList) {
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
                            onSearch={searchData}
                            style={{
                                width: 200,
                            }}
                        />
                        <Select
                            onChange={handleChangeFamily}
                            defaultValue={familyId}
                        >
                            {familyList.map((value) => (
                                <Select.Option key={value.id} value={value.id}>{value.family_name}</Select.Option>
                            ))}
                        </Select>
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
                loading={tableLoading || isLoading}
                size="middle"
                scroll={{ x: 'calc(700px + 50%)' }}
            />
            <Modal
                title="Send Referral Code" 
                open={isModalReferralOpen} 
                footer={null}
            >
                <Input placeholder="Email Receiver (ex. someone@example.com)" onChange={handleOnChangeEmailReferral} value={referralRequest.sent_to_email}/>
                <Space style={{"marginTop": "16px"}}>
                    <Button type="link" htmlType="button" onClick={handleCancelModalReferral}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleSubmitModalReferral}>
                        Send Email
                    </Button>
                </Space>
            </Modal>
        </CompleteLayout>
    )
};
export default AdminPersonList;