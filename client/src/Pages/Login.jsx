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
        <div className="flex min-h-screen flex-col justify-center px-6 lg:px-8 bg-gradient-to-b from-gray-darkest to-cyan-normal">
            <div className="flex flex-col justify-center py-4 px-4 bg-gray-dark border-1 border-salmon-light">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="text-center text-3xl font-extrabold text-salmon-light">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <form className="space-y-6" onSubmit={submitHandler}>
                        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

                        <div>
                            <label htmlFor="email" className="block text-md font-bold text-orange-light">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="appearance-none block w-full px-3 py-2 rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"
                                    value={formInfo.email}
                                    onChange={changeHandler}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-md font-bold text-orange-light">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="appearance-none block w-full px-3 py-2 rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-orange-light sm:text-sm"

                                    value={formInfo.password}
                                    onChange={changeHandler}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light"
                            >
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-white">

                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid">
                            <div>
                                <Link to="/" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-maroon-normal text-sm font-medium text-white hover:bg-gray-normal no-underline">
                                    Back
                                </Link>
                            </div>
                            {/* Add additional social buttons here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login