import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = location.protocol + '//' + location.host;


export const MutationFetch = (apiURL, params) => {
    const authorisationData = HandleGetCookies("token", true);

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
    const errorCode = error.response.status

    console.log(error)
    if (errorCode === 401) {
        window.location.href = `${BASE_URL}`
    } else {
        window.location.href = `${BASE_URL}`
    }

    return 
}

export const HandleGetCookies = (cookiesName, logoutOnError) => {
    const cookiesData = Cookies.get(cookiesName);
    console.log(cookiesData === null);
    if (cookiesData == null && logoutOnError) {
        console.log("Unauthorize")
        return false
    }
    const decodeData = JSON.parse(cookiesData);

    return decodeData
}