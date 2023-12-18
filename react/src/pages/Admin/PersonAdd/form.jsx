import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
    Button,
    DatePicker,
    Form,
    Input,
    Radio,
    Switch,
    Upload,
} from 'antd';
const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const FormDisabledDemo = () => {
    const [ isUseImageFile, setIsUseImageFile ] = useState(false);

    const handleChangeSwitchImage = (checked) => {
        setIsUseImageFile(checked)
    }

    const handleOnFinishForm = (values) => {
        console.log(values)
    }

    return (
        <>
        <Form
            labelCol={{
            span: 6,
            }}
            wrapperCol={{
            span: 12,
            }}
            layout="horizontal"
            onFinish={handleOnFinishForm}
        >
            <Form.Item label="Name" name="name">
                <Input />
            </Form.Item>
            <Form.Item label="Gender" name="gender">
                <Radio.Group>
                    <Radio value="male"> Male </Radio>
                    <Radio value="female"> Female </Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Birthdate" name="birthdate">
                <DatePicker />
            </Form.Item>
            <Form.Item label="Use Image File" name="switchImage" valuePropName="checked">
                <Switch value={isUseImageFile} onChange={handleChangeSwitchImage} />
            </Form.Item>
            {isUseImageFile ? (
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload action="/upload.do" listType="picture-card">
                        <div>
                        <PlusOutlined />
                        <div
                            style={{
                            marginTop: 8,
                            }}
                        >
                            Upload
                        </div>
                        </div>
                    </Upload>
                </Form.Item>
            ) : (
                <Form.Item label="Image URL" name="img_url">
                    <Input />
                </Form.Item>
            )}
            <Form.Item label="Residence Location" name="live_loc">
                <TextArea />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
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
                <Button type="primary" style={{float: 'right'}} htmlType="submit">
                Add Person
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};
export default FormDisabledDemo;