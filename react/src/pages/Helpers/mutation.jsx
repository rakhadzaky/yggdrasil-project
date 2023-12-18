import axios from 'axios';
import { message } from 'antd';

export const MutationFetch = (apiURL, params) => {
    const authorisationData = JSON.parse(localStorage.getItem("token"));
    if (authorisationData === null) {
        window.location.href = `/`
        return
    }
    let currTime = new Date().getTime()
    let expTime = new Date().setTime(authorisationData.exp_time)
    if ( expTime < currTime ) {
        window.location.href = `/`
        return
    }
    return axios.get(apiURL, {
        headers: {
            "Authorization": authorisationData.type + " " + authorisationData.token,
        },
        params: {
            ...params
        }
    })
}

export const HandleError = (error) => {
    const [messageApi] = message.useMessage();

    const errorCode = error.response.status

    console.log(error)
    if (errorCode === 401) {
        return messageApi.open({
            type: 'error',
            content: 'Unauthorize',
        });
    } else {
        return messageApi.open({
            type: 'error',
            content: error.response.data.message,
        });
    }
}