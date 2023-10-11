import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
    // NOT RECOMMENDED TO SET THE WHOLE USER DUE TO PASSWORD
    const [user, setUser] = useState()
    const navigate = useNavigate()

    const logoutHandler = () => {
        axios.delete(`http://localhost:8000/api/users/logout`, { withCredentials: true })
            .then(res => {
                localStorage.clear();
                navigate("/")
            })
            .catch(err => {
                console.error("Error during logout:", err)
            })
    }

    useEffect(() => {
        axios.get(`http://localhost:8000/api/users/getUser`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch()
    }, [])

    return (
        <div>UserInfo
            <h1> Username : {user && user.username}</h1>
            <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                Home
            </Link>
            <button onClick={logoutHandler}>Logout</button>
        </div>

    )
}

export default UserInfo;

