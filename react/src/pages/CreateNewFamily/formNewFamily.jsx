import { Form, Input, Button } from 'antd'
import PropTypes from 'prop-types';

function FormNewFamily({familyData, handleCreateFamily, isLoading}) {
    const [form] = Form.useForm();

    const handleSubmitForm = (values) => {
        Object.keys(values).map((field_name) => {
            form.setFields([
                {
                    name: field_name,
                    errors: [],
                },
            ])
        });

        handleCreateFamily(values);
    }

    console.log(familyData);

    return (
        <>
            <Form form={form} onFinish={handleSubmitForm} initialValues={familyData}>
                <Form.Item name='family_name' label='Family Name' rules={[{ required: true }]} extra="ex. Jackson Family">
                    <Input placeholder='Your Family Name'/>
                </Form.Item>
                <Form.Item name='main_address' label='Main Address'>
                    <Input placeholder='Your Main Address' />
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
                        Save & Continue
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

FormNewFamily.propTypes = {
    familyData: PropTypes.object,
    handleCreateFamily: PropTypes.func,
    isLoading: PropTypes.bool,
}

export default FormNewFamily