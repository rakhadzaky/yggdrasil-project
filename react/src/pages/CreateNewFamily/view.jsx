import { useState } from 'react';
import { Col, Row, Typography, Steps, Breadcrumb, Empty, Button, App } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { MutationFetch, MutationSubmit, HandleGetCookies } from '../Helpers/mutation'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

import useHandleError from '../Helpers/handleError'
import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"

import FormNewFamily from "./formNewFamily"
import FormNewPerson from "./formNewPerson"
import FormVerification from "./formVerification"
import FinishPage from "./finishPage"

import { NEW_FAMILY_PERSON_ADMIN_API } from '@api'

const CreateNewFamily = () => {
    const { Title } = Typography;
    const BASE_URL = location.protocol + '//' + location.host;

    const [current, setCurrent] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [validationMessage, setValidationMessage] = useState();
    const [fileList, setFileList] = useState([]);

    const [familyData, setFamilyData] = useState();
    const [personData, setPersonData] = useState();
    
    const { handleError } = useHandleError();
    const navigate = useNavigate();
    const { message } = App.useApp()

    const changeStep = (value) => {
        console.log(value)
        setCurrent(value);
    };

    const handleCreateFamily = (value) => {
        setFamilyData(value);
        changeStep(current + 1);
    }

    const handleCreatePerson = (value) => {
        console.log(value)
        setPersonData(value);
        changeStep(current + 1);
    }

    const handleUpload = ({ fileList }) => {
        console.log(fileList);
        setFileList(fileList);
    };

    const handleCreateNewUser = () => {
        setIsLoading(true)

        // prepare data for person data
        var formData = new FormData();
        formData.append("family_id", personData.family_id);
        formData.append("name", personData.name);
        formData.append("gender", personData.gender);
        formData.append("birthdate", new Date(personData.birthdate).toISOString().split('T')[0]);
        if (personData.live_loc !== undefined) {
            formData.append("live_loc", personData.live_loc);   
        }
        if (personData.phone !== undefined) {
            formData.append("phone", personData.phone);   
        }
        if (!personData.switchImage) {
            formData.append("img_url", personData.img_url);
        } else {
            if (fileList.length > 0) {
                if (fileList[0].originFileObj !== undefined) {
                    formData.append("img_file", fileList[0].originFileObj);      
                }
            }
        }

        // prepare data for family
        formData.append("family_name", familyData.family_name);
        formData.append("main_address", familyData.main_address);

        MutationSubmit('post', `${NEW_FAMILY_PERSON_ADMIN_API}`, formData, true)
            .then((response) => {
                message.open({
                    type: 'success',
                    content: 'Create data success',
                    duration: 2,
                })
                setIsLoading(false)
                changeStep(current + 1);

                let userData = HandleGetCookies("userData", true);
                
                // add person id data to user data, then restore the user data
                userData = {
                    "person_id": response.data.inserted_id,
                    ...userData,
                }

                Cookies.set('userData', JSON.stringify(userData), { secure: true });
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false)
                handleError(error).then((res) => {
                    setValidationMessage(res);
                })
            });
    }

    return (
    <>
        <HeaderBar />
            <Row style={{minHeight: '90vh', padding: '60px 0'}}>
                <Col span={16} offset={4}>
                    <Title level={3}>Create New Family</Title>
                    <Breadcrumb
                        items={[
                        {
                            title: <HomeOutlined />,
                        },
                        {
                            href: `${BASE_URL}/pre/dashboard`,
                            title: 'Pre Dashboard',
                        },
                        {
                            title: 'Create New Family',
                        },
                        ]}
                    />
                    <Row style={{minHeight: '90vh', padding: '60px 0', backgroundColor: 'white'}}>
                        <Col span={6}>
                            <Steps
                                current={current}
                                direction="vertical"
                                onChange={changeStep}
                                items={[
                                {
                                    title: 'Create new family',
                                    description: 'It will be your family group',
                                },
                                {
                                    title: 'Create person data',
                                    description: 'Fill your biodata here',
                                },
                                {
                                    title: 'Verfication data',
                                    description: 'Check your data, is everything good?',
                                },
                                {
                                    title: 'Finish',
                                    description: 'Welcome to the Family',
                                },
                                ]}
                            />
                        </Col>
                        <Col span={18}>
                            {(() => {
                                if (current === 0) {
                                    return (
                                        <FormNewFamily familyData={familyData} handleCreateFamily={handleCreateFamily} isLoading={isLoading} validationMessage={validationMessage}/>
                                    )
                                } else if (current === 1) {
                                    return (
                                        <FormNewPerson personData={personData} handleOnFinishForm={handleCreatePerson} handleUpload={handleUpload} isLoading={isLoading} fileList={fileList}/>
                                    )
                                } else if (current === 2) {
                                    if (personData !== undefined) {
                                        return (
                                            <FormVerification personData={personData} fileList={fileList} familyData={familyData} handleCreateNewUser={handleCreateNewUser}/>
                                        )   
                                    } else {
                                        return(
                                            <Empty
                                                imageStyle={{ height: 60 }}
                                                description={
                                                <span>
                                                    Please insert data first
                                                </span>
                                                }
                                            >
                                                <Button onClick={() => changeStep(0)} type="primary">Create Now</Button>
                                            </Empty>
                                        )
                                    }
                                } else {
                                    return (
                                        <FinishPage />
                                    )
                                }
                            })()}
                        </Col>
                    </Row>
                </Col>
            </Row>
        <FooterBar />
    </>
)};
export default CreateNewFamily;