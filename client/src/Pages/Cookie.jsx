import axios from 'axios'
import React from 'react'
import Register from './Register';
import { useEffect } from 'react';






// CHANGED THE URL FROM APIURL/API/COOKIE TO APIURL/COOKIE
const Cookie = () => {
    // Deployment & Local using env variables
    useEffect(() => {
        const apiURL = process.env.REACT_APP_API_URL;
        console.log('cookie - apiURL: ', apiURL);
        axios.get(`${apiURL}/cookie`, { withCredentials: true })
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