import { useEffect, useState } from 'react';
import {
    Button,
    Form,
    Collapse,
    Row,
    Col,
    Typography,
    Divider,
    Checkbox,
    Select,
    Image,
    Descriptions,
    Spin,
} from 'antd';
import PropTypes from 'prop-types';
import { BACKEND_BASE_URL, PERSON_LIST_ADMIN_API, FAMILY_LIST_ADMIN_API } from '@api';

import { useQuery } from "react-query";
import { MutationFetch, HandleError } from '../../Helpers/mutation'

import ItemForm from './itemForm'

const { Title } = Typography;

const FormRelation = ({ personData, handleAssignRelation, isLoading, validationRelationMessage }) => {
    const person = personData
    const [form] = Form.useForm();
    const [familyList, setFamilyList] = useState()

    const [peopleData, setPeopleData] = useState({
        'father': [],
        'mother': [],
        'partner': [],
    })
    

    const mapGenderRelation = {
        "male": "female",
        "female": "male"
    }

    const handleSubmit = (values) => {
        Object.keys(values).map((field_name) => {
            form.setFields([
                {
                    name: field_name,
                    errors: [],
                },
            ])
        })

        handleAssignRelation(values);
    }

    useEffect(() => {
        if (validationRelationMessage !== undefined) {
            Object.keys(validationRelationMessage).map((field_name) => {
                form.setFields([
                    {
                        name: field_name,
                        errors: validationRelationMessage[field_name],
                    },
                ])
            })   
        }
    }, [validationRelationMessage])

    useEffect(() => {
        if (person.families !== undefined) {
            let tempPersonFamilyListId = [];
            Object.keys(person.families).map((i) => {
                tempPersonFamilyListId.push(person.families[i].family_id);
            })
            form.setFieldValue('family_id_list', tempPersonFamilyListId)
        }
    }, [person.families, form])

    const {isLoading: fatherDataLoading} = useQuery({
        queryKey: ['fetchPersonList', 'father'],
        queryFn: () =>
            MutationFetch(`${PERSON_LIST_ADMIN_API}`, {
                'gender': 'male',
            }),
        onError: (error) => {
            console.log(error.response.status)
            HandleError(error)
        },
        onSuccess: (response) => {
            let tempPeopleData = peopleData
            tempPeopleData.father = response.data.data

            setPeopleData(tempPeopleData)
        }
    })

    const {isLoading: motherDataLoading} = useQuery({
        queryKey: ['fetchPersonList', 'mother'],
        queryFn: () =>
            MutationFetch(`${PERSON_LIST_ADMIN_API}`, {
                'gender': 'female',
            }),
        onError: (error) => {
            console.log(error.response.status)
            HandleError(error)
        },
        onSuccess: (response) => {
            let tempPeopleData = peopleData
            tempPeopleData.mother = response.data.data

            setPeopleData(tempPeopleData)
        }
    })

    const {isLoading: partnerDataLoading} = useQuery({
        queryKey: ['fetchPersonList', 'partner'],
        queryFn: () =>
            MutationFetch(`${PERSON_LIST_ADMIN_API}`, {
                'gender': mapGenderRelation[person.gender],
            }),
        onError: (error) => {
            console.log(error.response.status)
            HandleError(error)
        },
        onSuccess: (response) => {
            let tempPeopleData = peopleData
            tempPeopleData.partner = response.data.data

            setPeopleData(tempPeopleData)
        }
    })

    const {isLoading: familyListLoading} = useQuery({
        queryKey: ['fetchFamilyList'],
        queryFn: () =>
            MutationFetch(`${FAMILY_LIST_ADMIN_API}`),
        onError: (error) => {
            console.log(error.response.status)
            HandleError(error)
        },
        onSuccess: (response) => {
            setFamilyList(response.data.data);
        }
    })

    console.log("family_list: ", familyList);

    if ((fatherDataLoading || peopleData.fatherlength <= 0) ||
        (motherDataLoading || peopleData.motherlength <= 0) ||
        (partnerDataLoading || peopleData.partner.length <= 0) ||
        (familyListLoading || familyList == undefined)) {
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
                span: 18,
            }}
            layout="horizontal"
            onFinish={handleSubmit}
            form={form}
        >
            <Row>
                <Col span={11}>
                    <Title level={4}>Biodata</Title>
                    <Divider />
                    {(person.img_file != '' && person.img_file != null) ? (
                        <Image
                            width={200}
                            src={`${BACKEND_BASE_URL}/${person.img_file}`}
                        />
                    ):(
                        <Image
                            width={200}
                            src={person.img_url}
                        />
                    )}
                    <Descriptions layout="vertical" style={{marginTop: "16px"}}>
                        <Descriptions.Item label="Name">{person.name}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{person.gender}</Descriptions.Item>
                        <Descriptions.Item label="Birthdate">{person.birthdate}</Descriptions.Item>
                        <Descriptions.Item label="Telephone">{person.phone}</Descriptions.Item>
                        <Descriptions.Item label="Live">{person.live_loc}</Descriptions.Item>
                    </Descriptions>

                </Col>
                <Col span={11} offset={2}>
                    <Title level={4}>Relation Data</Title>
                    <Divider />
                    <Collapse items={ItemForm(peopleData.father, peopleData.mother, peopleData.partner)} ghost bordered/> 
                    <Form.Item name="is_head_of_family" valuePropName="checked" style={{marginTop: '8px'}}>
                        <Checkbox>Set this person as Head of Family?</Checkbox>
                    </Form.Item>
                    <Title level={4}>Family Data</Title>
                    <Divider />
                    <Form.Item name="family_id_list">
                        <Select
                            loading={familyListLoading}
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            options={Object
                                .keys(familyList)
                                .map((i) => {
                                    return ({value: familyList[i].id, label: familyList[i].family_name})
                                })}
                        />
                    </Form.Item>
                </Col>
            </Row>
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
                    Update Relation
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};

FormRelation.propTypes = {
    personData: PropTypes.object,
    handleAssignRelation: PropTypes.func,
    personFamilyListId: PropTypes.array,
    isLoading: PropTypes.bool,
    validationRelationMessage: PropTypes.object,
};

export default FormRelation;