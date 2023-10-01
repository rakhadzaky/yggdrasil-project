import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
    Button,
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Slider,
    Switch,
    TreeSelect,
    Upload,
} from 'antd';
const { RangePicker } = DatePicker;
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
            span: 4,
            }}
            wrapperCol={{
            span: 14,
            }}
            layout="horizontal"
            style={{
            maxWidth: 600,
            }}
            onFinish={handleOnFinishForm}
        >
            <Form.Item label="Name" name="name">
                <Input />
            </Form.Item>
            <Form.Item label="Radio" name="gender">
                <Radio.Group>
                    <Radio value="male"> Male </Radio>
                    <Radio value="female"> Female </Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="DatePicker" name="birthdate">
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
            <Form.Item label="Live Location" name="live_loc">
                <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
                <Input />
            </Form.Item>            
            
            <Form.Item>
                <Button type="primary" htmlType='submit'>Button</Button>
            </Form.Item>
        </Form>
        </>
    );
};
export default FormDisabledDemo;