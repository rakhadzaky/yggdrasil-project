import { Card, Col, Row, Typography } from 'antd';
import { HandleGetCookies } from '../Helpers/mutation'
import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"
import { useNavigate } from "react-router-dom";

const PreDashboardUser = () => {
    const { Title } = Typography;
    const { Meta } = Card;
    const navigate = useNavigate();

    const userData = HandleGetCookies("userData", true);

    return (
    <>
        <HeaderBar />
            <Title level={2} style={{textAlign: "center"}}>Hi {userData.name}!,</Title>
            <Title level={4} type='secondary' style={{textAlign: "center"}}>
                it looks like you are not related with any family at the moment.
                <br />Please fill in your details or use a referral code to join an existing family relationship
            </Title>
            <Title level={4} type='secondary' style={{textAlign: "center"}}>
                Which one are you?
            </Title>
            <Row gutter={16} style={{textAlign:"center", margin: "24px"}}>
                <Col span={4} offset={6}>
                    <Card
                        hoverable
                        cover={<img alt="create_new_family" style={{height: 256}} src="http://localhost:8000/storage/assets/undraw_selecting_team_re_ndkb.svg" />}
                    >
                        <Meta title="I'll fill my data" description="Fill your data and create your new family" />
                    </Card>
                </Col>
                <Col span={4} offset={4}>
                    <Card
                        hoverable
                        onClick={() => navigate("/pre/referral")}
                        cover={<img alt="submit_referral_code" style={{height: 256}} src="http://localhost:8000/storage/assets/undraw_referral_re_0aji.svg" />}
                    >
                        <Meta title="I have my family's referral code" description="Get referral code from your family member and join the party!" />
                    </Card>
                </Col>
            </Row>
        <FooterBar />
    </>
)};
export default PreDashboardUser;