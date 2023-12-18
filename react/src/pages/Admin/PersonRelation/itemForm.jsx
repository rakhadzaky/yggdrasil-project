import React from 'react'

import {Form, Select} from 'antd';

function ItemForm(fatherData, motherData, partnerData) {
    return [
        {
            key: '1',
            label: 'Father Relation',
            children: (
                <Form.Item label="Select a person" name="fid">
                    <Select
                        showSearch="showSearch"
                        placeholder="Select a person"
                        optionFilterProp="children"
                        options={Object
                            .keys(fatherData)
                            .map((i) => {
                                console.log(fatherData[i])
                                return ({value: fatherData[i].id, label: fatherData[i].name})
                            })}/>
                </Form.Item>
            )
        }, {
            key: '2',
            label: 'Mother Relation',
            children: (
                <Form.Item label="Select a person" name="mid">
                    <Select
                        showSearch="showSearch"
                        placeholder="Select a person"
                        optionFilterProp="children"
                        options={Object
                            .keys(motherData)
                            .map((i) => {
                                console.log(motherData[i])
                                return ({value: motherData[i].id, label: motherData[i].name})
                            })}/>
                </Form.Item>
            )
        }, {
            key: '3',
            label: 'Partner Relation',
            children: (
                <Form.Item label="Select a person" name="pid_relation">
                    <Select
                        showSearch="showSearch"
                        placeholder="Select a person"
                        optionFilterProp="children"
                        options={Object
                            .keys(partnerData)
                            .map((i) => {
                                console.log(partnerData[i])
                                return ({value: partnerData[i].id, label: partnerData[i].name})
                            })}/>
                </Form.Item>
            )
        }
    ]
}

export default ItemForm