import axios from 'axios'
import React from 'react'
import Register from './Register';
import { useEffect } from 'react';







const Cookie = () => {
    useEffect(() => {
        axios.get(`https://allsquare.club/api/cookie`, { withCredentials: true })
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