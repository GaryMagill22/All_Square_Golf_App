import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom'




const Login = () => {


    const [errorsLog, setErrorsLog] = useState('');
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    })




    const changeHandler = (e) => {
        let { name, value } = e.target
        setUserInfo({
            ...userInfo,
            [name]: value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/users/login', userInfo, { withCredentials: true })
            .then(res => navigate("/users"))
            .catch(err => {
                // console.log(err.response.data)
                const errorResponse = err.response.data; // Get the errors from err.response.data
                setErrorsLog(errorResponse.msg);
            })
    }


    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Email</label>
                    <input type="text" name="email" value={userInfo.email} onChange={changeHandler} />
                    {errorsLog && <div style={{ color: 'red' }}>{errorsLog}</div>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={userInfo.password} onChange={changeHandler} />
                    {errorsLog && <div style={{ color: 'red' }}>{errorsLog}</div>}
                </div>
                <button className="btn btn-outline-primary" type="submit"> Login </button>
            </form>

            <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>

        </div>
    )
}

export default Login

