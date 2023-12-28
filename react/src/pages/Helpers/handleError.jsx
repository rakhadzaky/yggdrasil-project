import { App } from 'antd';
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect } from 'react';

function useHandleError (error) {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const doHandleError = useCallback( async(error) => {
        console.log(error)
        console.log(error.response)
        const errorCode = error.response.status
        if (errorCode === 401) {
            message.open({
                type: 'error',
                content: "unauthorize",
            });
            navigate(`/`)
        } else if (errorCode >= 500) {
            message.open({
                type: 'error',
                content: "something went wrong, please try again later",
            });
            navigate(`/`)
        } else {
            message.open({
                type: 'error',
                content: 'something went wrong',
            });
            console.log(error.response.data.message);
            return error.response.data.message;
        }
    }, [error])

    useEffect(() => {
        if (error) {
            doHandleError
        }
    })

    return {handleError: doHandleError}
}

export default useHandleError;