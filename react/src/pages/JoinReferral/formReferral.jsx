import { Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';

function FormReferral({SearchReferralCode, isLoading}) {
    return (
        <>
            <Form onFinish={SearchReferralCode}>
                <Form.Item label="Referral Code" name="referral_code">
                    <Input />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                    offset: 8,
                    span: 16,
                    }}
                    style={{
                        marginTop: '8px'
                    }}
                >
                    <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isLoading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

FormReferral.propTypes = {
    SearchReferralCode: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default FormReferral