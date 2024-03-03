import { useState } from 'react';
import { Row, Col, Spin, Breadcrumb, App } from 'antd';
import FormCreatePerson from "./form"
import CompleteLayout from '../Layout/CompleteLayout';

import {useParams} from "react-router-dom";
import { useQuery } from "react-query";
import { MutationFetch, MutationSubmit } from '../../Helpers/mutation';
import useHandleError from '../../Helpers/handleError';
import { useNavigate } from "react-router-dom";

import {BACKEND_BASE_URL, PERSON_DETAIL_ADMIN_API, PERSON_UPDATE_ADMIN_API} from "@api";

function AdminPersonEdit() {
    const [person, setPerson] = useState({});
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const {pid} = useParams()
    const [fileList, setFileList] = useState([]);
    const [validationMessage, setValidationMessage] = useState([]);
    const { handleError } = useHandleError();
    const navigate = useNavigate();
    const { message } = App.useApp()

    const {isLoading} = useQuery({
        queryKey: ['fetchPersonList', pid],
        queryFn: () =>
            MutationFetch(`${PERSON_DETAIL_ADMIN_API}/${pid}`),
        onError: (error) => {
            handleError(error)
        },
        onSuccess: (response) => {
            setPerson(response.data.data)
            setFileList([
                {
                    uid: '-1',
                    name: response.data.data.img_file.split('/').at(-1),
                    status: 'done',
                    url: `${BACKEND_BASE_URL}/${response.data.data.img_file}`,
                },
            ])
        }
    })

    const handleOnFinishForm = (values) => {
        setIsLoadingButton(true)

        // prepare data for person data
        var formData = new FormData();
        formData.append("family_id", values.family_id);
        formData.append("name", values.name);
        formData.append("gender", values.gender);
        formData.append("birthdate", new Date(values.birthdate).toISOString().split('T')[0]);
        if (values.live_loc !== undefined) {
            formData.append("live_loc", values.live_loc);   
        }
        if (values.phone !== undefined) {
            formData.append("phone", values.phone);   
        }
        if (fileList.length > 0) {
            if (fileList[0].originFileObj !== undefined) {
                formData.append("img_file", fileList[0].originFileObj);      
            }
        }

        MutationSubmit('post', `${PERSON_UPDATE_ADMIN_API}/${pid}`, formData, true)
            .then(() => {
                message.open({
                    type: 'success',
                    content: 'Update data success',
                    duration: 2,
                })
                setIsLoadingButton(false)
                navigate(`/admin/person/all-list`)
            })
            .catch(error => {
                setIsLoadingButton(false)
                handleError(error).then((res) => {
                    setValidationMessage(res);
                })
            });
    }

    const handleUpload = ({ fileList }) => {
        setFileList(fileList);
    };

    if (isLoading) {
        return (
            <CompleteLayout>
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
            </CompleteLayout>
        )
    }

    return (
        <>
            <CompleteLayout>
                <div style={{textAlign:'right', padding:'0 20px 20px 0'}}>
                    <Row>
                        <Col span={12}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                                <Breadcrumb.Item>Person</Breadcrumb.Item>
                                <Breadcrumb.Item>Relation</Breadcrumb.Item>
                                <Breadcrumb.Item>{person.name}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row>
                </div>
                <Row style={{minHeight: '90vh', padding: '60px 0', backgroundColor: 'white'}}>
                    <Col span={16} offset={2}>
                        <FormCreatePerson
                            personData={person}
                            handleOnFinishForm={handleOnFinishForm}
                            handleUpload={handleUpload}
                            isLoading={isLoadingButton}
                            fileList={fileList}
                            validationMessage={validationMessage}
                        />
                    </Col>
                </Row>
            </CompleteLayout>
            </>
    )
}

export default AdminPersonEdit