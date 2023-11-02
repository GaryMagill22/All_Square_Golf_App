import axios from 'axios'
import React from 'react'
import Register from './Register';
import { useEffect } from 'react';







const Cookie = () => {
    // Deployment & Local using env variables
    useEffect(() => {

        const apiURL = process.env.REACT_APP_API_URL;
        axios.get(`${apiURL}/api/cookie`, { withCredentials: true })
            .then(res => console.log("success!"))
            .catch(err => console.log(err));
    }, [])
    
    return (
        <div>
            <Register />
        </div>
    )
}

export default Cookie