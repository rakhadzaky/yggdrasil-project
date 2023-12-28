import { useState } from 'react';
import { Row, Col, Breadcrumb, Steps, Empty, Button } from 'antd';
import { useQuery } from "react-query";
import { MutationFetch, MutationSubmit } from '../../Helpers/mutation'
import useHandleError from '../../Helpers/handleError'

import Form from "./form";
import FormRelation from "./formRelation";
import FormInvitation from "./formInvitation";
import CompleteLayout from '../Layout/CompleteLayout';

import {PERSON_DETAIL_ADMIN_API, ASSIGN_PERSON_RELATION_ADMIN_API, ADMIN_CREATE_REFERRAL_API} from "@api";

function AdminPersonAdd() {
    const { handleError } = useHandleError();

    const [person, setPerson] = useState({});
    const [fileList, setFileList] = useState([]);
    const [PID, setPID] = useState(0);
    const [personFamilyListId, setPersonFamilyListId] = useState([]);
    const [current, setCurrent] = useState(PID != 0 ? 1 : 0);
    const [isLoading, setIsLoading] = useState(false);

    const [validationPersonMessage, setValidationPersonMessage] = useState([]);
    const [validationRelationMessage, setValidationRelationMessage] = useState([]);

    const onChange = (value) => {
        setCurrent(value);
    };

    useQuery({
        enabled: (PID != 0),
        queryKey: ['fetchPersonList', PID],
        queryFn: () =>
            MutationFetch(`${PERSON_DETAIL_ADMIN_API}/${PID}`),
        onError: (error) => {
            handleError(error)
        },
        onSuccess: (response) => {
            setPerson(response.data.data);
            let tempPersonFamilyListId = personFamilyListId;
            tempPersonFamilyListId = [];
            Object.keys(response.data.data.families).map((i) => {
                tempPersonFamilyListId.push(response.data.data.families[i].family_id);
            })
            setPersonFamilyListId(tempPersonFamilyListId)
        }
    })

    const handleOnFinishForm = (values) => {
        setIsLoading(true)

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
        if (!values.switchImage) {
            formData.append("img_url", values.img_url);
        } else {
            if (fileList.length > 0) {
                formData.append("img_file", fileList[0].originFileObj);   
            }
        }

        MutationSubmit('post', `${PERSON_DETAIL_ADMIN_API}`, formData, true)
            .then((response) => {
                setPID(response.data.inserted_id);
                onChange(current + 1);
                setIsLoading(false)
            })
            .catch(error => {
                setIsLoading(false)
                handleError(error).then((res) => {
                    setValidationPersonMessage(res);
                })
            });
    }

    const handleUpload = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleAssignRelation = (values) => {
        setIsLoading(true)

        let bodyData = {
            ...values,
            pid: PID,
        }

        MutationSubmit('post', `${ASSIGN_PERSON_RELATION_ADMIN_API}`, bodyData, true)
            .then(() => {
                onChange(current + 1);
                setIsLoading(false)
            })
            .catch(error => {
                setIsLoading(false)
                handleError(error).then((res) => {
                    setValidationRelationMessage(res);
                })
            });
    }

    const handleInviteUser = (values) => {
        setIsLoading(true)

        let bodyData = {
            ...values,
            submited_person_id: PID,
        }

        MutationSubmit('post', `${ADMIN_CREATE_REFERRAL_API}`, bodyData, true)
            .then(() => {
                setIsLoading(false)
            })
            .catch(error => {
                setIsLoading(false)
                handleError(error)
            });
    }

    return(
        <>
        <CompleteLayout>
            <div style={{textAlign:'right', padding:'0 20px 20px 0'}}>
                <Row>
                    <Col span={12}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Person</Breadcrumb.Item>
                            <Breadcrumb.Item>Add</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
            </div>
            <Row style={{minHeight: '90vh', padding: '60px 0', backgroundColor: 'white'}}>
                <Col span={4} offset={2}>
                    <Steps
                        current={current}
                        direction="vertical"
                        items={[
                            {
                                title: 'Create Person Data',
                                description: 'Fill the biodata of the person',
                            },
                            {
                                title: 'Relation and Family',
                                description: 'Connect the person to existing data',
                            },
                            {
                                title: 'Finish',
                                description: 'Finish and Invitation to user',
                            },
                        ]}
                    />
                </Col>
                <Col span={16}>
                    {(() => {
                        if (current === 0) {
                            return (
                                <Form handleOnFinishForm={handleOnFinishForm} handleUpload={handleUpload} isLoading={isLoading} validationPersonMessage={validationPersonMessage}/>
                            )
                        } else if (current === 1) {
                            if (PID != 0) {
                                return (
                                    <FormRelation personData={person} handleAssignRelation={handleAssignRelation} personFamilyListId={personFamilyListId} isLoading={isLoading} validationRelationMessage={validationRelationMessage}/>
                                )   
                            } else {
                                <Empty
                                    imageStyle={{ height: 60 }}
                                    description={
                                    <span>
                                        Please insert data first
                                    </span>
                                    }
                                >
                                    <Button onClick={() => onChange(0)} type="primary">Create Now</Button>
                                </Empty>
                            }
                        } else {
                            return (
                                <FormInvitation personData={person} handleInviteUser={handleInviteUser} isLoading={isLoading} />
                            )
                        }
                    })()}
                </Col>
            </Row>
        </CompleteLayout>
        </>
    )
}

export default AdminPersonAdd