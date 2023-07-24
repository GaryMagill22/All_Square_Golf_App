import axios from 'axios'
import React, { useEffect } from 'react'
import Register from './Register';

const Cookie = () => {
    // useEffect(() => {
    //     axios.get(`http://localhost:8000/api/cookie`, { withCredentials: true })
    //         .then(response => console.log("success"))
    //         .catch(err => console.log(err));
    // }, [])
    return (
        <div>
            <Register />
        </div>
    )
}

export default Cookie