import { useState } from 'react';
import axios from 'axios';
import { Space, Table, Divider, Row, Col, Spin, message, Button } from 'antd';
import Header from "../Layout/header"
import FooterBar from "../Layout/footer"
import Form from "./form"

import { useQuery } from "react-query";

import {PERSON_LIST_ADMIN_API} from "@api";

const BASE_URL = location.protocol + '//' + location.host;

function AdminPersonAdd() {
    return(
        <>
        <Header />
        <Row style={{minHeight: '90vh', padding: '60px 0'}}>
            <Col span={16} offset={4}>
                <Divider orientation="left">
                    Add Person
                </Divider>
                <Form />
            </Col>
        </Row>
        <FooterBar />
        </>
    )
}

export default AdminPersonAdd