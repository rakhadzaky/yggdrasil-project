import { useState, useEffect } from 'react';
import { Descriptions, Image, Divider, Row, Col, Spin, Breadcrumb, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Header from "../Layout/header"
import FooterBar from "../Layout/footer"
import {useParams} from "react-router-dom";
import { BACKEND_BASE_URL, PERSON_DETAIL_API } from '@api';

import { MutationFetch } from '../Helpers/mutation'

const DetailPerson = () => {
    const [person, setPerson] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { Title } = Typography

    const {pid} = useParams()
    const BASE_URL = location.protocol + '//' + location.host;

    useEffect(() => {
        MutationFetch(`${PERSON_DETAIL_API}/${pid}`)
            .then(response => {
                setPerson(response.data.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                console.error(error.response.data);
            });
    }, []);

    if (isLoading) {
        return (
            <>
                <Header />
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
                <FooterBar />
            </>
        )
    }

    return(
    <>
    <Header />
    <Row style={{minHeight: '90vh', padding: '60px 0'}}>
        <Col span={16} offset={4}>
            <Title level={3}>Person Detail</Title>
            <Breadcrumb
                items={[
                {
                    title: <HomeOutlined />,
                },
                {
                    href: `${BASE_URL}/dashboard/${pid}`,
                    title: 'Family Tree',
                },
                {
                    title: 'Person Detail',
                },
                ]}
            />
            <div style={{margin:"10px"}}></div>
            {(person.img_file != '' && person.img_file != null) ? (
                <Image
                    width={200}
                    src={`${BACKEND_BASE_URL}/${person.img_file}`}
                />
            ):(
                <Image
                    width={200}
                    src={person.img_url}
                />
            )}
            <Divider orientation="left">
                Biodata
            </Divider>
            <Descriptions>
                <Descriptions.Item label="Name">{person.name}</Descriptions.Item>
                <Descriptions.Item label="Gender">{person.gender}</Descriptions.Item>
                <Descriptions.Item label="Birthdate">{person.birthdate}</Descriptions.Item>
                <Descriptions.Item label="Telephone">{person.phone}</Descriptions.Item>
                <Descriptions.Item label="Live">{person.live_loc}</Descriptions.Item>
            </Descriptions>
        </Col>
    </Row>
    <FooterBar />
    </>
)};
export default DetailPerson;