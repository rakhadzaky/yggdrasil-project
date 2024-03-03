import { useState } from 'react';
import { useQuery } from "react-query";

import { Space, Table, Row, Col, Spin, Button, Breadcrumb, Input, Tag, Select, App, Dropdown, Modal } from 'antd';
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons';

import CompleteLayout from "../Layout/CompleteLayout"

import { MutationFetch, MutationSubmit } from '../../Helpers/mutation'
import useHandleError from '../../Helpers/handleError'

import {PERSON_FAMILY_LIST_ADMIN_API, ADMIN_GALLERY_LIST} from "@api";

import { HandleGetCookies } from '../../Helpers/mutation'

function FamilyGallery() {
    const [familyList, setFamilyList] = useState([]);
    const [galleryList, setGalleryList] = useState([]);
    const [familyId, setFamilyId] = useState();
    const [tableLoading, setTableLoading] = useState(false);
    const [initiateLoading, setInitiateLoading] = useState(true);

    const { handleError } = useHandleError();
    const { message } = App.useApp()

    const BASE_URL = location.protocol + '//' + location.host;

    const userData = HandleGetCookies("userData", true);
    const userPID = userData.person_id;

    const {isLoading: isLoadingFamilyList} = useQuery({
        queryKey: ['fetchFamilyList', familyId],
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

    const {isLoading: isLoadingFamiliesGalleryList} = useQuery({
        queryKey: ['fetchFamiliesGalleryList', familyId],
        enabled: familyId > 0,
        queryFn: () =>
            MutationFetch(`${ADMIN_GALLERY_LIST}/${familyId}`)
            .then(response => {
                setGalleryList(response.data.data)
                setTableLoading(false)
                setInitiateLoading(false)
            })
            .catch(error => {
                handleError(error);
                setTableLoading(false);
                setInitiateLoading(false);
            })
    })

    const handleChangeFamily = (value) => {
        setTableLoading(true);
        setFamilyId(value);
        // refetch()
    }

    const handleDropdownItemClick = (e) => {
        const keySplit = e.key.split("-");
        switch (keySplit[0]) {
            case 'view_gallery':
                window.location.href = `${BASE_URL}/admin/gallery/detail/${keySplit[1]}`;
                break;
            case 'edit_gallery':
                window.location.href = `${BASE_URL}/admin/gallery/detail/${keySplit[1]}`;
                break;
        
            default:
                break;
        }
    };

    if (initiateLoading || isLoadingFamilyList) {
        return (
            <CompleteLayout>
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
            </CompleteLayout>
        )
    }

    return (
        <CompleteLayout>
            <div style={{padding:'0 20px 20px 0'}}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Gallery</Breadcrumb.Item>
                        <Breadcrumb.Item>Family Gallery</Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        <Col span={12}>
                            <Select
                                onChange={handleChangeFamily}
                                defaultValue={familyId}
                                style={{
                                    width: 200,
                                }}
                            >
                                {familyList.map((value) => (
                                    <Select.Option key={value.id} value={value.id}>{value.family_name}</Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={12} style={{textAlign:'right', }}>
                            <Button type="primary">Create New Gallery</Button>
                        </Col>
                    </Row>
                </div>
                <Table
                    columns={[
                        {
                            title: 'Gallery Title',
                            dataIndex: 'gallery_title',
                            key: 'gallery_title',
                        },
                        {
                            title: 'Description',
                            dataIndex: 'description',
                            key: 'description',
                        },
                        {
                            title: 'Date',
                            dataIndex: 'gallery_date',
                            key: 'gallery_date',
                        },
                        {
                            title: 'Total Photo',
                            dataIndex: 'photos_count',
                            key: 'photos_count',
                        },
                        {
                            title: 'Action',
                            key: 'action',
                            fixed: 'right',
                            render: (record, index) => {
                                const items = [
                                    {
                                        key: `view_gallery-${index.id}`,
                                        label: 'View Gallery',
                                    },
                                    {
                                        key: `edit_gallery-${index.id}`,
                                        label: `Edit Gallery`,
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
                    ]}
                    dataSource={galleryList}
                    loading={tableLoading || isLoadingFamiliesGalleryList}
                    size="middle"
                    scroll={{ x: 'calc(700px + 50%)' }}
                />
        </CompleteLayout>
    )
}

export default FamilyGallery