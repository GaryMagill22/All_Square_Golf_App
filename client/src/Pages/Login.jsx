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
                console.log('User logged in successfully!');
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
        <div className="">
            <h2>Login</h2>
            <form onSubmit={submitHandler}>
                {
                errorMsg && <p className="text-danger">{errorMsg}</p>
                }

                <div className="">
                    <input
                        type="text"
                        name="email"
                        value={formInfo.email}
                        onChange={changeHandler}
                        
                    />
                    <label>Email</label>
                </div>

                <div className="">
                    <input
                        type="password"
                        name="password"
                        value={formInfo.password}
                        onChange={changeHandler}
                    />
                    <label>Password</label>
                </div>

                <button className="" type="submit" disabled={isLoading}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    {isLoading && <span className='spinner-border spinner-border-sm' role='status' ></span>}
                    Submit
                </button>
            </form>
        <button className="">
            <Link to={"/"} >Back</Link>
        </button>
        </div>

    )
}

export default Login