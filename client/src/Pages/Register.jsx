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

        // Reset Error Messages
        setErrors({});

        // Create local variable to store potential errors
        let validationErrors = {};

         // Check for empty fields
    if (!formInfo.firstName.trim()) validationErrors.firstName = "First name is required";
    if (!formInfo.lastName.trim()) validationErrors.lastName = "Last name is required";
    if (!formInfo.email.trim()) validationErrors.email = "Email is required";
    if (!formInfo.username.trim()) validationErrors.username = "Username is required";
    if (!formInfo.password.trim()) validationErrors.password = "Password is required";
    if (!formInfo.confirmPassword.trim()) validationErrors.confirmPassword = "Confirm password is required";

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (formInfo.email && !emailRegex.test(formInfo.email)) {
        validationErrors.email = "Please enter a valid email address";
    }

    // Check if passwords match
    if (formInfo.password !== formInfo.confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match";
    }

    // If there are any errors, stop the function and display them
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsLoading(false);
        return;
    }


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
                navigate("/home");
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
                    {errors.firstName ? <p className="text-danger" >{errors.firstName}</p> : ""}
                </div>

                <div>
                    <label htmlFor="lastName" >Lastname</label>
                    <input type="text" name="lastName" value={formInfo.lastName} onChange={changeHandler} />
                    {errors.lastName ? <p className="text-danger"  >{errors.lastName}</p> : ""}
                </div>
                <div>
                    <label htmlFor="email" >Email</label>
                    <input type="text" name="email" value={formInfo.email} onChange={changeHandler} />
                    {errors.email ? <p className="text-danger"  >{errors.email}</p> : ""}

                </div>
                <div>
                    <label htmlFor="username" >Username: </label>
                    <input type="text" name="username" value={formInfo.username} onChange={changeHandler} />
                    {errors.username ? <p className="text-danger"  >{errors.username}</p> : ""}

                </div>
                <div>
                    <label htmlFor="password" >Password</label>
                    <input type="password" name="password" value={formInfo.password} onChange={changeHandler} />
                    {errors.password ? <p className="text-danger"  >{errors.password}</p> : ""}

                </div>
                <div>
                    <label htmlFor="confirmPassword" >Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formInfo.confirmPassword} onChange={changeHandler} />
                    {errors.confirmPassword ? <p className="text-danger"  >{errors.confirmPassword}</p> : ""}

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
                    {errors.handicap ? <p className="text-danger"  >{errors.handicap}</p> : ""}

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


