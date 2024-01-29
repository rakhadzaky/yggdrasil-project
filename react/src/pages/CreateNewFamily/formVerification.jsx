import { Image, Divider, Descriptions, Row, Col, Button, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

function FormVerification({personData, fileList, familyData, handleCreateNewUser}) {
    const { confirm } = Modal;

    const showConfirm = () => {
        confirm({
            title: 'Are you sure the data is correct?',
            icon: <ExclamationCircleFilled />,
            content: 'You can edit the data again later',
            onOk() {
                handleCreateNewUser();
            },
        });
    };

    return (
        <>
            <Row>
                <Col md={24} lg={8} style={{textAlign:"center"}}>
                    <Image
                        width={200}
                        src={fileList[0].thumbUrl}
                    />
                </Col>
                <Col md={24} lg={16}>
                    <Divider orientation="left">
                        Biodata
                    </Divider>
                    <Descriptions>
                        <Descriptions.Item label="Name">{personData.name}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{personData.gender}</Descriptions.Item>
                        <Descriptions.Item label="Birthdate">{new Date(personData.birthdate).toISOString().split('T')[0]}</Descriptions.Item>
                        <Descriptions.Item label="Telephone">{personData.phone}</Descriptions.Item>
                        <Descriptions.Item label="Live">{personData.live_loc}</Descriptions.Item>
                    </Descriptions>
                    <Divider orientation="left">
                        Family Data
                    </Divider>
                    <Descriptions>
                        <Descriptions.Item label="Name">{familyData.family_name}</Descriptions.Item>
                        <Descriptions.Item label="Address">{familyData.main_address}</Descriptions.Item>
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

FormVerification.propTypes = {
    personData: PropTypes.object,
    fileList: PropTypes.array,
    familyData: PropTypes.object,
    handleCreateNewUser: PropTypes.func,
};

export default FormVerification