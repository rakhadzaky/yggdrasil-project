import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import {
    Button,
    Form,
    Input,
    Collapse,
    Row,
    Col,
    Typography,
    Divider,
    Checkbox,
    Select,
    Image,
    Descriptions,
    Spin
} from 'antd';
import { BACKEND_BASE_URL, PERSON_LIST_ADMIN_API } from '@api';

import {useParams} from "react-router-dom";
import { useQuery } from "react-query";
import { MutationFetch, HandleError } from '../../Helpers/mutation'

import ItemForm from './itemForm'

const { Title } = Typography;

const itemsRelation = [
    {
        key: '1',
        label: 'Father Relation',
        children: (
            <Form.Item label="Select a person" name="fid">
                <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    options={[
                    {
                        value: 'jack',
                        label: 'Jack',
                    },
                    {
                        value: 'lucy',
                        label: 'Lucy',
                    },
                    {
                        value: 'tom',
                        label: 'Tom',
                    },
                    ]}
                />
            </Form.Item>
        ),
    },
    {
        key: '2',
        label: 'Mother Relation',
        children: (
            <Form.Item label="Select a person" name="mid">
                <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    options={[
                    {
                        value: 'jack',
                        label: 'Jack',
                    },
                    {
                        value: 'lucy',
                        label: 'Lucy',
                    },
                    {
                        value: 'tom',
                        label: 'Tom',
                    },
                    ]}
                />
            </Form.Item>
        ),
    },
    {
        key: '3',
        label: 'Partner Relation',
        children: (
            <Form.Item label="Select a person" name="pid_relation">
                <Select
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    options={[
                    {
                        value: 'jack',
                        label: 'Jack',
                    },
                    {
                        value: 'lucy',
                        label: 'Lucy',
                    },
                    {
                        value: 'tom',
                        label: 'Tom',
                    },
                    ]}
                />
            </Form.Item>
        ),
    },
];

const FormRelation = (personData) => {
    const person = personData.personData
    const [searchFather, setSearchFather] = useState()
    const [searchMother, setSearchMother] = useState()
    const [searchPartner, setSearchPartner] = useState()

    const [peopleData, setPeopleData] = useState({
        'father': [],
        'mother': [],
        'partner': [],
    })

    const handleOnFinishForm = (values) => {
        console.log(values)
    }

    const {isLoading: fatherDataLoading, refetch: fatherDataRefetch} = useQuery({
        queryKey: ['fetchPersonList', 'father', searchFather],
        queryFn: () =>
            MutationFetch(`${PERSON_LIST_ADMIN_API}`, {
                'gender': 'male',
                'search': searchFather
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

    const {isLoading: motherDataLoading, refetch: motherDataRefetch} = useQuery({
        queryKey: ['fetchPersonList', 'mother', searchMother],
        queryFn: () =>
            MutationFetch(`${PERSON_LIST_ADMIN_API}`, {
                'gender': 'female',
                'search': searchMother
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

    const {isLoading: partnerDataLoading, refetch: partnerDataRefetch} = useQuery({
        queryKey: ['fetchPersonList', 'partner', searchPartner],
        queryFn: () =>
            MutationFetch(`${PERSON_LIST_ADMIN_API}`, {
                'search': searchPartner
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

    if (fatherDataLoading || motherDataLoading || partnerDataLoading) {
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
            onFinish={handleOnFinishForm}
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
                    <Form.Item name="is_head_of_family" style={{marginTop: '8px'}}>
                        <Checkbox>Set this person as Head of Family?</Checkbox>
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
                <Button type="primary" style={{float: 'right'}} htmlType="submit">
                    Update Relation
                </Button>
            </Form.Item>
        </Form>
        </>
    );
};
export default FormRelation;