import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import axios from 'axios';

import Header from "../Layout/header"
import FooterBar from "../Layout/footer"

import GraphTree from './Components/GraphTree/view'

import {useParams} from "react-router-dom";

import { PERSON_FAMILY_TREE_API } from '@api';

const View = () => {
    const BASE_URL = location.protocol + '//' + location.host;
    const [nodes, setNodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const {pid} = useParams()

    useEffect(() => {
        axios.get(`${PERSON_FAMILY_TREE_API}/${pid}`)
            .then(response => {
                appendFamilyNodes(response.data.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                console.error(error.response.data);
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
                <Header />
                <div style={{margin: "20px 0", marginBottom: "20px", padding: "30px 50px", textAlign: "center", minHeight: '90vh'}}>
                    <Spin />
                </div>
                <FooterBar />
            </>
        )
    }

    return (
        <>
            <Header />
            <GraphTree nodes={nodes} />
            <FooterBar />
        </>
    );
};
export default View;