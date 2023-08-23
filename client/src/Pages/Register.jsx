import React, { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Axios } from '../helpers/axiosHelper';


const Register = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [formInfo, setFormInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        handicap: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({});




    const changeHandler = (e) => {
        setFormInfo({
            ...formInfo,
            [e.target.name]: e.target.value
        })
    }






    const submitHandler = async (e) => {
        e.preventDefault()
        setIsLoading(true);

        try {
            const response = await Axios({
                url: '/users/register/new',
                method: 'post',
                body: formInfo,
            });
            console.log('response', response);
            if (!response.user) {
                setIsLoading(false);
                setErrors(response.errors)
            } else {
                alert('Registration successful');
                navigate("/login");
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
                    <label htmlFor="firstName" >Firstname: </label>
                    <input type="text" name="firstName" value={formInfo.firstName} onChange={changeHandler} />
                    {errors.firstName ? <p className="text-danger" >{errors.firstName.message}</p> : ""}
                </div>

                <div>
                    <label htmlFor="lastName" >Lastname</label>
                    <input type="text" name="lastName" value={formInfo.lastName} onChange={changeHandler} />
                    {errors.lastName ? <p className="text-danger"  >{errors.lastName.message}</p> : ""}
                </div>
                <div>
                    <label htmlFor="email" >Email</label>
                    <input type="text" name="email" value={formInfo.email} onChange={changeHandler} />
                    {errors.email ? <p className="text-danger"  >{errors.email.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="username" >Username: </label>
                    <input type="text" name="username" value={formInfo.username} onChange={changeHandler} />
                    {errors.username ? <p className="text-danger"  >{errors.username.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="password" >Password</label>
                    <input type="password" name="password" value={formInfo.password} onChange={changeHandler} />
                    {errors.password ? <p className="text-danger"  >{errors.password.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="confirmPassword" >Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formInfo.confirmPassword} onChange={changeHandler} />
                    {errors.confirmPassword ? <p className="text-danger"  >{errors.confirmPassword.message}</p> : ""}

                </div>
                <div>
                    <label htmlFor="handicap" name="handicap" className="form-label">Handicap: </label>
                    <input onChange={changeHandler} // Call the changeHandler function here
                        type="number"
                        className="form-control"
                        id="handicap"
                        name="handicap" // Add the name attribute to match the state key
                        placeholder="Enter your handicap"
                        value={formInfo.handicap} />
                    {errors.handicap ? <p className="text-danger"  >{errors.handicap.message}</p> : ""}

                </div>



                <button type="submit" className="btn btn-outline-danger" disabled={isLoading}>
                    {
                        isLoading && <span className='spinner-border spinner-border-sm' role='status' aria-hidden="true"></span>
                    }
                    Register
                </button>
                <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>
            </form >

        </div >
    )
}

export default Register


