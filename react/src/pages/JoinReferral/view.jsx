import { useState } from 'react';
import { Col, Row, Typography, Steps, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { MutationFetch, MutationSubmit, HandleGetCookies } from '../Helpers/mutation'
import Cookies from 'js-cookie';
import useHandleError from '../Helpers/handleError'
import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"

import FormReferral from "./formReferral"
import VerificationId from "./verificationId"
import WelcomeToFamily from "./welcomeToFamily"

import { ADMIN_SEARCH_REFERRAL_API, ADMIN_INVALIDATE_REFERRAL_API } from '@api'

const JoinReferral = () => {
    const { Title } = Typography;
    const BASE_URL = location.protocol + '//' + location.host;

    const [current, setCurrent] = useState(0);
    const [referralCode, setReferralCode] = useState('');
    const [offeredPersonData, setOfferedPersonData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { handleError } = useHandleError();

    const changeStep = (value) => {
        setCurrent(value);
    };

    const SearchReferralCode = (value) => {
        setIsLoading(true);
        MutationFetch(`${ADMIN_SEARCH_REFERRAL_API}/${value.referral_code}`)
            .then(response => {
                changeStep(current + 1);
                setOfferedPersonData(response.data.person);
                setReferralCode(value.referral_code);
                setIsLoading(false);
            })
            .catch(error => {
                handleError(error);
                setIsLoading(false);
            });
    }

    const InvalidateReferralCode = () => {
        setIsLoading(true);
        MutationSubmit('post', `${ADMIN_INVALIDATE_REFERRAL_API}`,
            {
                referral_code: referralCode
            }
        )
            .then(() => {
                changeStep(current + 1);
                let userData = HandleGetCookies("userData", true);
                
                // add person id data to user data, then restore the user data
                userData = {
                    "person_id": offeredPersonData.id,
                    ...userData,
                }

                Cookies.set('userData', JSON.stringify(userData), { secure: true });
                setIsLoading(false);
            })
            .catch(error => {
                handleError(error);
                setIsLoading(false);
            });
    }

    return (
    <>
        <HeaderBar />
            <Row style={{minHeight: '90vh', padding: '60px 0'}}>
                <Col span={16} offset={4}>
                    <Title level={3}>Submit Refrral Code</Title>
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
                            title: 'Submit Referral Code',
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
                                    title: 'Referral Code',
                                    description: 'Submit you referral code',
                                },
                                {
                                    title: 'Verification',
                                    description: 'Check your identity',
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
                                        <FormReferral SearchReferralCode={SearchReferralCode} isLoading={isLoading}/>
                                    )
                                } else if (current === 1) {
                                    return (
                                        <VerificationId offeredPersonData={offeredPersonData} InvalidateReferralCode={InvalidateReferralCode} />
                                    )
                                } else {
                                    return (
                                        <WelcomeToFamily />
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
export default JoinReferral;