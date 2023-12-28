import { useState } from 'react';
import { Row, Col, Spin, Breadcrumb, App } from 'antd';
import FormRelation from "./form"
import CompleteLayout from '../Layout/CompleteLayout';

import {useParams} from "react-router-dom";
import { useQuery } from "react-query";
import { MutationFetch, MutationSubmit, HandleError } from '../../Helpers/mutation'
import useHandleError from '../../Helpers/handleError'

import { useNavigate } from "react-router-dom";

import {PERSON_DETAIL_ADMIN_API, ASSIGN_PERSON_RELATION_ADMIN_API} from "@api";

function AdminPersonAdd() {
    const [person, setPerson] = useState({});
    const {pid} = useParams()
    const { handleError } = useHandleError();
    const { message } = App.useApp()

    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [validationRelationMessage, setValidationRelationMessage] = useState([]);

    const navigate = useNavigate();

    const {isLoading} = useQuery({
        queryKey: ['fetchPersonList', pid],
        queryFn: () =>
            MutationFetch(`${PERSON_DETAIL_ADMIN_API}/${pid}`),
        onError: (error) => {
            console.log(error.response.status)
            HandleError(error)
        },
        onSuccess: (response) => 
            setPerson(response.data.data),
    })

    const handleAssignRelation = (values) => {
        setIsLoadingButton(true)

        let bodyData = {
            ...values,
            pid: pid,
        }

        MutationSubmit('post', `${ASSIGN_PERSON_RELATION_ADMIN_API}`, bodyData, false)
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
                    setValidationRelationMessage(res);
                })
            });
    }

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
                    <FormRelation personData={person} handleAssignRelation={handleAssignRelation} isLoading={isLoadingButton} validationRelationMessage={validationRelationMessage}/>
                </Col>
            </Row>
        </CompleteLayout>
        </>
    )
}

export default AdminPersonAdd