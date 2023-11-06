import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Axios } from '../helpers/axiosHelper';




const Login = () => {


    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);

        // Email Validation if empty
        if (!formInfo.email.trim()) {
            setErrorMsg("Email is required");
            setIsLoading(false);
            return;
        }

         // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formInfo.email)) {
        setErrorMsg("Please enter a valid email address");
        setIsLoading(false);
        return;
    }

        // Check if password is entered
    if (!formInfo.password.trim()) {
        setErrorMsg("Password is required");
        setIsLoading(false);
        return;
    }

        try {
            const response = await Axios({
                url: '/users/login',
                method: 'post',
                body: formInfo,
            });
            if (response.user) {
                localStorage.setItem('user_id', JSON.stringify(response.user._id));
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('players', JSON.stringify(response.user._id));
                setTimeout(() => {
                    setIsLoading(false);
                    navigate("/home");
                }, 3000);
            } else {
                setErrorMsg(response.msg)
            }
        } catch (err) {
            setIsLoading(false);
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
                <button className="btn btn-outline-primary" type="submit" disabled={isLoading}>
                    {
                        isLoading && <span className='spinner-border spinner-border-sm' role='status' aria-hidden="true"></span>
                    }
                    Login
                </button>
            </form>

            <button type="button" className="btn btn-outline-danger" >
                <Link to={"/"} >Back</Link>
            </button>

        </div>
    )
}

export default Login