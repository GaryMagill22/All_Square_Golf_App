import React, { useState } from 'react';
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
        if (!formInfo.handicap.trim()) validationErrors.handicap = "Handicap is required";

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (formInfo.email && !emailRegex.test(formInfo.email)) {
            validationErrors.email = "Please enter a valid email address";
        }

        // Validate password length must be atleast 8 characters
        if (formInfo.password.length & formInfo.confirmPassword.length < 8) {
            validationErrors.password = "Password must be at least 8 characters";
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
                navigate("/login");
            }
        } catch (err) {
            setIsLoading(false);
            console.log(err)
        }

    }


    return (
        <div className="bg-gradient-to-b from-gray-dark to-cyan-normal min-h-screen flex flex-col justify-center px-2 sm:px-2 lg:px-2">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="pb-4 text-center text-3xl sm:text-3xl font-extrabold text-salmon-light">
                    Register your account
                </h2>
            </div>

            <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
                <form className="space-y-2 bg-gray-darkest shadow-md rounded px-6 py-3 sm:p-6 border-1 border-salmon-light" onSubmit={submitHandler}>
                    <div>
                        <label htmlFor="firstName" className="block text-md font-bold text-orange-light">
                            First Name:
                        </label>
                        <input
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            className="mt-1 block w-full rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                            value={formInfo.firstName}
                            onChange={changeHandler}
                        />
                        {errors.firstName && <p className="mt-2 text-sm text-red-500">{errors.firstName}</p>}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-md font-bold text-orange-light">
                            Last Name:
                        </label>
                        <input
                            name="lastName"
                            type="text"
                            className="mt-1 block w-full rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                            value={formInfo.lastName}
                            onChange={changeHandler}
                        />
                        {errors.lastName && <p className="mt-2 text-sm text-red-500">{errors.lastName}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-md font-bold text-orange-light">
                            Email:
                        </label>
                        <div>
                            <input
                                name="email"
                                type="email"
                                className="mt-1 block w-full rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                                value={formInfo.email}
                                onChange={changeHandler}
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-md font-bold text-orange-light">
                            Username:
                        </label>
                        <input
                            name="username"
                            type="text"
                            className="mt-1 block w-full rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                            value={formInfo.username}
                            onChange={changeHandler}
                        />
                        {errors.username && <p className="mt-2 text-sm text-red-500">{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-md font-bold text-orange-light">
                            Password:
                        </label>
                        <input
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                            value={formInfo.password}
                            onChange={changeHandler}
                        />
                        {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-md font-bold text-orange-light">
                            Confirm Password:
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="mt-1 block w-full rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                            value={formInfo.confirmPassword}
                            onChange={changeHandler}
                        />
                        {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <label htmlFor="handicap" className="block text-md font-bold text-orange-light">
                            Handicap:
                        </label>
                        <input
                            name="handicap"
                            type="number"
                            className="mt-1 w-32 rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                            value={formInfo.handicap}
                            onChange={changeHandler}
                            min="0"
                            max="40"
                            step="1"
                        />
                        {errors.handicap && <p className="mt-2 text-sm text-red-500">{errors.handicap}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-9/12 inline-flex justify-center py-2 mb-2 mt-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                            {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                            Register
                        </button>
                    </div>
                    <div className="mt-2">
                        <Link to="/" className="w-9/12 inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                            Back
                        </Link>
                    </div>

                </form>


            </div>
        </div>

    )
}

export default Register
