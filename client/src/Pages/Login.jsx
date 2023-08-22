import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom'




const Login = () => {


    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState(null);

    const [formInfo, setFormInfo] = useState({
        email: "",
        password: "",
    })




    const changeHandler = (e) => {
        setFormInfo({
            ...formInfo,
            [e.target.name]: e.target.value
        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8000/api/users/login', formInfo, { withCredentials: true })
            .then(res => {
                if (res.data.msg === "success!") {
                    navigate("/users")
                } else {
                    setErrorMsg(res.data.msg)
                }
            })
            .catch(err => console.log(err))

    }


    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    {errorMsg ? <p className="text-danger" >{errorMsg}</p> : ""}
                    <label>Email</label>
                    <input type="text" name="email" value={formInfo.email} onChange={changeHandler} />

                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={formInfo.password} onChange={changeHandler} />

                </div>
                <button className="btn btn-outline-primary" type="submit"> Login </button>
            </form>

            <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>

        </div>
    )
}

export default Login

