import { useState, useEffect } from 'react';
import { Spin } from 'antd';

import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"

import GraphTree from './Components/GraphTree/view'
import { MutationFetch } from '../Helpers/mutation'
import useHandleError from '../Helpers/handleError'
import { HandleGetCookies } from '../Helpers/mutation'

import { PERSON_FAMILY_TREE_API } from '@api';

const ViewAlternate = () => {
    const BASE_URL = location.protocol + '//' + location.host;
    const [nodes, setNodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { handleError } = useHandleError();

    const userData = HandleGetCookies("userData", true);
    const userPID = userData.person_id;

    useEffect(() => {
        MutationFetch(`${PERSON_FAMILY_TREE_API}/${userPID}`)
            .then(response => {
                appendFamilyNodes(response.data.data);
                setIsLoading(false);
            })
            .catch(error => {
                handleError(error);
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
            <HeaderBar />
            <GraphTree nodes={nodes} />
            <FooterBar />
        </>
    );
};
export default ViewAlternate;