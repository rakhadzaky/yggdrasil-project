import axios from 'axios';

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