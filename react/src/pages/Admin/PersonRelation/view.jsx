import { useState } from 'react';
import axios from 'axios';
import { Space, Table, Divider, Row, Col, Spin, message, Button, Breadcrumb } from 'antd';
import FormRelation from "./form"
import CompleteLayout from '../Layout/CompleteLayout';

import {useParams} from "react-router-dom";
import { useQuery } from "react-query";
import { MutationFetch, HandleError } from '../../Helpers/mutation'

import {PERSON_DETAIL_ADMIN_API} from "@api";

const BASE_URL = location.protocol + '//' + location.host;

function AdminPersonAdd() {
    const [person, setPerson] = useState({});
    const {pid} = useParams()

    const {isLoading, refetch} = useQuery({
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
                    <FormRelation personData={person} />
                </Col>
            </Row>
        </CompleteLayout>
        </>
    )
}

export default AdminPersonAdd