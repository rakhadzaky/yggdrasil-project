import { useState, useEffect } from 'react';
import { Descriptions, Image, Divider, Row, Col, Spin, Breadcrumb, Typography, Card, Empty  } from 'antd';
import { HomeOutlined, FileSearchOutlined } from '@ant-design/icons';
import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"
import {useParams} from "react-router-dom";
import { BACKEND_BASE_URL, PERSON_DETAIL_API } from '@api';
import useHandleError from '../Helpers/handleError'

import { MutationFetch } from '../Helpers/mutation'

const DetailPerson = () => {
    const [person, setPerson] = useState({});
    const [family, setFamily] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { Title } = Typography
    const { handleError } = useHandleError();

    const {pid} = useParams()
    const BASE_URL = location.protocol + '//' + location.host;

    useEffect(() => {
        MutationFetch(`${PERSON_DETAIL_API}/${pid}`)
            .then(response => {
                setPerson(response.data.data);
                if (response.data.data.family !== null) {
                    setFamily(response.data.data.family);   
                }
                setIsLoading(false);
            })
            .catch(error => {
                handleError(error);
            });
    }, []);

    if (isLoading) {
        return (
            <>
                <HeaderBar />
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
                <FooterBar />
            </>
        )
    }

    return(
    <>
    <HeaderBar />
    <Row style={{minHeight: '90vh', padding: '60px 0'}}>
        <Col span={16} offset={4}>
            <Title level={3}>Person Detail</Title>
            <Breadcrumb
                items={[
                {
                    title: <HomeOutlined />,
                },
                {
                    href: `${BASE_URL}/dashboard`,
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
            <Divider orientation="left">
                Related Family
            </Divider>
            <Row>
                {(Object.keys(family).length > 0) ? (
                    <>
                        {Object.keys(family).map((familyRelation, i) => {
                            if (family[familyRelation] !== null) {
                                return(
                                    <Col xs={24} xl={6} md={10} style={{margin:'8px'}} key={familyRelation+i}>
                                        <Card
                                            hoverable
                                            style={{
                                                width: '100%',
                                            }}
                                            actions={[
                                                <a href={`${BASE_URL}/person/${family[familyRelation].id}`} key="detail"><FileSearchOutlined /></a>,
                                            ]}
                                        >
                                            <Row>
                                                <Col span={11}>
                                                    <img alt="example" src={family[familyRelation].img_url} style={{maxWidth:'100%', borderRadius: '8px'}} />
                                                </Col>
                                                <Col span={11} offset={2}>
                                                    <p><b>{family[familyRelation].name}</b></p>
                                                    <p>{familyRelation}</p>
                                                    <p>{family[familyRelation].live_loc}</p>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                )
                            }
                        })}
                    </>
                ):(
                    <Empty />
                )}
            </Row>
        </Col>
    </Row>
    <FooterBar />
    </>
)};
export default DetailPerson;