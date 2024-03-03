import { useState, useEffect } from 'react';
import {
    Button,
    DatePicker,
    Form,
    Input,
    Radio,
    Upload,
    Divider,
    Select,
    Spin
} from 'antd';
import PropTypes from 'prop-types';
import { useQuery } from "react-query";
import { MutationFetch, HandleError, HandleGetCookies } from '../../Helpers/mutation'
import { PERSON_FAMILY_LIST_ADMIN_API } from '@api';

const { TextArea } = Input;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};
const FormCreatePerson = ({handleOnFinishForm, handleUpload, isLoading, validationPersonMessage}) => {
    const [form] = Form.useForm();
    const [familyList, setFamilyList] = useState()
    const userData = HandleGetCookies("userData", true);
    const userPID = userData.person_id;

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
        if (validationPersonMessage !== undefined) {
            Object.keys(validationPersonMessage).map((field_name) => {
                form.setFields([
                    {
                        name: field_name,
                        errors: validationPersonMessage[field_name],
                    },
                ])
            })   
        }
    }, [validationPersonMessage])

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

    const {isLoading: familyListLoading} = useQuery({
        queryKey: ['fetchFamilyList'],
        queryFn: () =>
            MutationFetch(`${PERSON_FAMILY_LIST_ADMIN_API}/${userPID}`),
        onError: (error) => {
            console.log(error.response.status)
            HandleError(error)
        },
        onSuccess: (response) => {
            setFamilyList(response.data.data);
        }
    })

    if (familyListLoading) {
        return (
            <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                <Spin />
            </div>
        )
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
            onFinish={handleSubmit}
            form={form}
        >
            <Form.Item label="Create person for family" name="family_id" rules={[{ required: true, message: 'Please select the family' }]}>
                <Select
                    options={Object
                        .keys(familyList)
                        .map((i) => {
                            return ({value: familyList[i].id, label: familyList[i].family_name})
                        })}
                />
            </Form.Item>
            <Divider />
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
                    Add Person
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

FormCreatePerson.propTypes = {
    handleOnFinishForm: PropTypes.func,
    handleUpload: PropTypes.func,
    isLoading: PropTypes.bool,
    validationPersonMessage: PropTypes.object
};

export default FormCreatePerson;