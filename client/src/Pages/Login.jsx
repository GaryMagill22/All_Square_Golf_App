import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from 'react-router-dom';
import { Axios } from '../helpers/axiosHelper';




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

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                url: '/users/login',
                method: 'post',
                body: formInfo,
            });
            if (response.msg === "success!") {
                localStorage.setItem('isLoggedIn', true);
                navigate("/users");
                /*setTimeout(() => {
                    navigate("/users");
                }, 3000);*/
            } else {
                setErrorMsg(response.msg)
            }
        } catch (err) {
            console.log(err)
        }
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