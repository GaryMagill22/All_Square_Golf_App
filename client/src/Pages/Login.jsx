import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom'
// import PayPalConnectButton from '../Components/PayPalConnectButton';




const Login = () => {
    const [errorsLog, setErrorsLog] = useState('');
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
                console.log(err.response.data)
                const errorResponse = err.response.data; // Get the errors from err.response.data
                setErrorsLog(errorResponse.msg);
            })
    }


    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Email</label>
                    <input type="text" name="email" value={user.email} onChange={changeHandler} />
                    {errorsLog && <div style={{ color: 'red' }}>{errorsLog}</div>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={user.password} onChange={changeHandler} />
                    {errorsLog && <div style={{ color: 'red' }}>{errorsLog}</div>}
                </div>
                <button className="btn btn-outline-primary" type="submit"> Login </button>
            </form>

            <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>
            {/* <div>
                <PayPalConnectButton />
            </div> */}
        </div>
    )
}

export default Login

