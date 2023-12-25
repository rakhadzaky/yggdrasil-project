import { Image, Divider, Descriptions, Row, Col, Button, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

function VerificationId({offeredPersonData, InvalidateReferralCode}) {
    const { confirm } = Modal;

    const showConfirm = () => {
    confirm({
        title: 'Are you sure the data is correct?',
        icon: <ExclamationCircleFilled />,
        content: 'Once your account assigned as this person, changes only can be done by Admin',
        onOk() {
            InvalidateReferralCode();
        },
    });
    };
    return (
        <>
            <Row>
                <Col md={24} lg={8} style={{textAlign:"center"}}>
                    <Image
                        width={200}
                        src={offeredPersonData.img_url}
                    />
                </Col>
                <Col md={24} lg={16}>
                    <Divider orientation="left">
                        Biodata
                    </Divider>
                    <Descriptions>
                        <Descriptions.Item label="Name">{offeredPersonData.name}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{offeredPersonData.gender}</Descriptions.Item>
                        <Descriptions.Item label="Birthdate">{offeredPersonData.birthdate}</Descriptions.Item>
                        <Descriptions.Item label="Telephone">{offeredPersonData.phone}</Descriptions.Item>
                        <Descriptions.Item label="Live">{offeredPersonData.live_loc}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col md={{span: 24, offset: 0}} lg={{ span: 12, offset: 12 }} style={{textAlign: 'right'}}>
                    <Button type='primary' style={{marginTop: '20px'}}
                        onClick={showConfirm}
                    >Confirm this is me</Button>
                </Col>
            </Row>
        </>
    )
}

VerificationId.propTypes = {
    offeredPersonData: PropTypes.object,
    InvalidateReferralCode: PropTypes.func,
};

export default VerificationId