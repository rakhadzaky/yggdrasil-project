import { useEffect } from 'react';
import {
    Button,
    DatePicker,
    Form,
    Input,
    Radio,
    Upload,
} from 'antd';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const FormCreatePerson = ({personData, handleOnFinishForm, handleUpload, isLoading, fileList, validationMessage}) => {
    const [form] = Form.useForm();

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

    useEffect(() => {
        if (validationMessage !== undefined) {
            Object.keys(validationMessage).map((field_name) => {
                form.setFields([
                    {
                        name: field_name,
                        errors: validationMessage[field_name],
                    },
                ])
            })   
        }
    }, [validationMessage])

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
            initialValues={{
                name: personData.name,
                gender: personData.gender,
                live_loc: personData.live_loc || "",
                phone: personData.phone,
                birthdate: dayjs(personData.birthdate),
            }}
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
                    Update Person
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

FormCreatePerson.propTypes = {
    personData: PropTypes.object,
    handleOnFinishForm: PropTypes.func,
    handleUpload: PropTypes.func,
    isLoading: PropTypes.bool,
    fileList: PropTypes.object,
    validationMessage: PropTypes.object,
};

export default FormCreatePerson;