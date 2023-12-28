import { Typography, Input, Button, Divider,Space, Form } from 'antd'
import PropTypes from 'prop-types';

function FormInvitation({personData, handleInviteUser, isLoading}) {
    const { Text, Title } = Typography;
    const BASE_URL = location.protocol + '//' + location.host;
    return (
        <>
            <Title level={2}>Person data has been created</Title>
            <Space direction="vertical">
                <Text type={"secondary"}>Person data successfully created, you can back to <a href={`${BASE_URL}/admin/person/all-list`}>table</a> or <a href={`${BASE_URL}/dashboard`}>dashboard</a> to see the changes.</Text>
                <Text type={"secondary"}>You can also invite other user, to join as <b>{personData.name}</b> using invitation form below</Text>
            </Space>
            <Divider />
            <Text>Please enter email for an invitation</Text>
            <Form onFinish={handleInviteUser}>
                <Form.Item name="sent_to_email">
                    <Input placeholder='email@example.com'></Input>
                </Form.Item>
                <Form.Item
                    style={{
                        marginTop: '8px'
                    }}
                >
                    <Button type='primary' style={{marginTop: "20px"}} htmlType='submit' loading={isLoading}>Submit</Button>
                </Form.Item>
            </Form>
        </>
    )
}

FormInvitation.propTypes = {
    personData: PropTypes.object,
    handleInviteUser: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default FormInvitation