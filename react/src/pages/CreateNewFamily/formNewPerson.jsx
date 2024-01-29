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
import PropTypes from 'prop-types';

const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const FormNewPerson = ({personData, handleOnFinishForm, handleUpload, isLoading, fileList}) => {
    const [form] = Form.useForm();
    const [ isUseImageFile, setIsUseImageFile ] = useState((personData !== undefined ? personData.img_file !== null : false));

    const handleChangeSwitchImage = (checked) => {
        setIsUseImageFile(checked)
    }

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleSubmit = (values) => {
        Object.keys(values).map((field_name) => {
            form.setFields([
                {
                    name: field_name,
                    errors: [],
                },
            ])
        })

        handleOnFinishForm(values);
    }

    console.log(personData);
    console.log(fileList);

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
            onFinish={handleSubmit}
            form={form}
            initialValues={personData}
        >
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the person name' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please enter the person gender' }]}>
                <Radio.Group>
                    <Radio value="male"> Male </Radio>
                    <Radio value="female"> Female </Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Birthdate" name="birthdate" rules={[{ required: true, message: 'Please enter the person birthdate' }]}>
                <DatePicker />
            </Form.Item>
            <Form.Item label="Use Image File" name="switchImage" valuePropName="checked">
                <Switch value={isUseImageFile} onChange={handleChangeSwitchImage} />
            </Form.Item>
            {isUseImageFile ? (
                <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                    <Upload
                        listType="picture-card"
                        onChange={handleUpload}
                        onPreview={onPreview}
                        beforeUpload={() => false} 
                        maxCount={1}
                        accept="image/png, image/jpeg"
                        fileList={fileList}
                    >
                        {'+ Upload'}
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
                <Button type="primary" style={{float: 'right'}} htmlType="submit" loading={isLoading}>
                    Save & Continue
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

FormNewPerson.propTypes = {
    personData: PropTypes.object,
    handleOnFinishForm: PropTypes.func,
    handleUpload: PropTypes.func,
    isLoading: PropTypes.bool,
    fileList: PropTypes.array,
};

export default FormNewPerson;