import { useState } from 'react';
import { useQuery } from "react-query";

import { Space, Table, Row, Col, Spin, Button, Breadcrumb, Input, Tag, Select, App, Dropdown, Modal, Image, Upload, message } from 'antd';
import { DownOutlined, ExclamationCircleFilled, InboxOutlined } from '@ant-design/icons';

import { MutationFetch, MutationSubmit } from '../../Helpers/mutation'
import useHandleError from '../../Helpers/handleError'
import {useParams} from "react-router-dom";

import {ADMIN_GALLERY_PHOTOS_LIST, BACKEND_BASE_URL, ADMIN_UPLOAD_PHOTOS, ADMIN_PHOTOS_ADD} from "@api";

import CompleteLayout from "../Layout/CompleteLayout"

function FamilyGalleryDetail() {
    const { Dragger } = Upload;
    const {gid} = useParams()
    const { handleError } = useHandleError();

    const [tableLoading, setTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [photosList, setPhotosList] = useState([]);

    const {isLoading: isLoadingFamiliesPhotosList, refetch: photoListRefetch} = useQuery({
        queryKey: ['fetchFamiliesPhotosList', gid],
        queryFn: () =>
            MutationFetch(`${ADMIN_GALLERY_PHOTOS_LIST}/${gid}`)
            .then(response => {
                setPhotosList(response.data.data.photos)
                setTableLoading(false)
            })
            .catch(error => {
                handleError(error);
                setTableLoading(false);
            })
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        handleUpload()
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [fileListUpload, setFileListUpload] = useState([]);
    const [uploading, setUploading] = useState(false);
    const handleUpload = () => {
        const formData = new FormData();
        fileListUpload.forEach((file) => {
            formData.append('img_file[]', file);
        });
        formData.append('photo_type', 'gallery');
        setUploading(true);
        // You can use any AJAX library you like

        MutationSubmit('post', `${ADMIN_UPLOAD_PHOTOS}`, formData, true)
            .then((response) => {
                handleAddPhotoToGallery(response.data.image_location);
                setFileListUpload([]);
                message.success('upload successfully.');
                setIsModalOpen(false);
            })
            .catch(error => {
                handleError(error)
            })
            .finally(() => {
                setUploading(false);
                photoListRefetch();
            });
    };

    const handleAddPhotoToGallery = (img_location) => {
        let bodyData = {
            "gallery_id": gid,
            "img_address": img_location
        }

        MutationSubmit('post', `${ADMIN_PHOTOS_ADD}`, bodyData, false)
            .then(() => {
                message.open({
                    type: 'success',
                    content: 'Update data success',
                    duration: 2,
                })
                setTableLoading(false)
            })
            .catch(error => {
                setTableLoading(false)
                handleError(error)
            });
    }

    const props = {
        onRemove: (file) => {
            const index = fileListUpload.indexOf(file);
            const newFileListUpload = fileListUpload.slice();
            newFileListUpload.splice(index, 1);
            setFileListUpload(newFileListUpload);
        },
        beforeUpload: (_, fileList) => {
            setFileListUpload([...fileListUpload, ...fileList]);
                return false;
            },
        multiple: true,
        fileListUpload,
    };

    console.log(fileListUpload)

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
                        
                    </Col>
                    <Col span={12} style={{textAlign:'right', }}>
                        <Button type="primary" onClick={showModal}>Add Photos</Button>
                    </Col>
                </Row>
            </div>

            <Modal
                title="Upload Photos" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel} 
                width={1000} 
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={uploading} onClick={handleOk}>
                        Upload
                    </Button>,
                ]}
            >
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                    </p>
                </Dragger>
            </Modal>

            <div style={{padding:'40px', backgroundColor:'white', borderRadius:'10px'}}>
                {isLoadingFamiliesPhotosList ? (
                    <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                        <Spin />
                    </div>
                ) : (
                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        <Space size={[16, 16]} wrap>
                            {
                                Object.keys(photosList).map((id) => {
                                    return(
                                        <>
                                            <Image width={200} src={`${BACKEND_BASE_URL}/${photosList[id].img_address}`} />
                                        </>
                                    )
                                })
                            }
                        </Space>
                    </Image.PreviewGroup>
                )}
            </div>
        </CompleteLayout>
    )
}

export default FamilyGalleryDetail