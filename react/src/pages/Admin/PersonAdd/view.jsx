import { useState } from 'react';
import axios from 'axios';
import { Space, Table, Divider, Row, Col, Spin, message, Button, Breadcrumb } from 'antd';
import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"
import Form from "./form"
import CompleteLayout from '../Layout/CompleteLayout';

import { useQuery } from "react-query";

import {PERSON_LIST_ADMIN_API} from "@api";

const BASE_URL = location.protocol + '//' + location.host;

function AdminPersonAdd() {
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
                <Col span={16} offset={2}>
                    <Form />
                </Col>
            </Row>
        </CompleteLayout>
        </>
    )
}

export default AdminPersonAdd