import { useState, useEffect } from 'react';
import { Spin } from 'antd';

import HeaderBar from "../Layout/header"
import FooterBar from "../Layout/footer"

import GraphTree from './Components/GraphTree/view'
import { MutationFetch } from '../../Helpers/mutation'
import useHandleError from '../../Helpers/handleError'
import { HandleGetCookies } from '../../Helpers/mutation'

import { GUEST_FAMILY_LIST_API } from '@api';

const GuestFamilyTree = () => {
    const BASE_URL = location.protocol + '//' + location.host;
    const [nodes, setNodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { handleError } = useHandleError();

    const auth = HandleGetCookies("token", true);
    const guestCode = auth.guest_code;

    useEffect(() => {
        MutationFetch(`${GUEST_FAMILY_LIST_API}/${guestCode}`)
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
export default GuestFamilyTree;