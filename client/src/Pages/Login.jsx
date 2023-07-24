import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const [setErrorsLog] = useState('');
    const navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: "",
    })

    const changeHandler = (e) => {
        let { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:8000/api/users/login`, user, { withCredentials: true })
            .then(res => navigate("/users"))
            .catch(err => {
                console.log(err.response.data.msg)
                const errorResponse = err.response.data.msg; // Get the errors from err.response.data
                setErrorsLog(errorResponse);
            })
    }


    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Email</label>
                    <input type="text" name="email" value={user.email} onChange={changeHandler} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={user.password} onChange={changeHandler} />
                </div>

                <button className="btn btn-outline-primary" type="submit"> Login </button>
            </form>
            <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>
        </div>
    )
}

export default Login

