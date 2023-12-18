import { useState, useEffect } from 'react';
import { Spin, message } from 'antd';

import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"

import GraphTree from './Components/GraphTree/view'
import { MutationFetch } from '../Helpers/mutation'

import {useParams} from "react-router-dom";

import { PERSON_FAMILY_TREE_API } from '@api';

const View = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const BASE_URL = location.protocol + '//' + location.host;
    const [nodes, setNodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {pid} = useParams()

    useEffect(() => {
        MutationFetch(`${PERSON_FAMILY_TREE_API}/${pid}`)
            .then(response => {
                appendFamilyNodes(response.data.data);
                setIsLoading(false);
            })
            .catch(error => {
                messageApi.open({
                    type: 'error',
                    content: error.response.data.message,
                });
                setIsLoading(false);
            });
    }, []);

    const appendFamilyNodes = (respData) => {
        var famillies = []
        Object.keys(respData).forEach(familyIndex => {
            respData[familyIndex]['link'] = `${BASE_URL}/person/${respData[familyIndex]['id']}`
            famillies.push(respData[familyIndex]);
        });

        setNodes(famillies);
    }

    if (isLoading) {
        return (
            <>
                {contextHolder}
                <HeaderBar />
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
                <FooterBar />
            </>
        )
    }

    return (
        <>
            {contextHolder}
            <HeaderBar />
            <GraphTree nodes={nodes} />
            <FooterBar />
        </>
    );
};
export default View;