import React, { useState } from 'react'
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
    const [setHandicap] = useState('');

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        handicap: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate();

    const changeHandler = (e) => {
        let { name, value } = e.target
        setUser({
            ...user,
            [name]: value

        })
    }

    const submitHandler = (e) => {
        e.preventDefault()
        axios.post(`http://localhost:8000/api/users/register/new`, user, { withCredentials: true })
            .then(res => {
                console.log(res.data)
                navigate('/users')
            })
            .catch(err => console.log(err.response))
    }


    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <label>Firstname: </label>
                    <input type="text" name="firstName" value={user.firstName} onChange={changeHandler} />
                </div>

                <div>
                    <label>Lastname</label>
                    <input type="text" name="lastName" value={user.lastName} onChange={changeHandler} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="text" name="email" value={user.email} onChange={changeHandler} />
                </div>
                <div>
                    <label>Username: </label>
                    <input type="text" name="userName" value={user.userName} onChange={changeHandler} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={user.password} onChange={changeHandler} />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={changeHandler} />
                </div>
                <div >
                    <label htmlFor="handicap" className="form-label">Handicap: </label>
                    <input onChange={(e) => setHandicap(e.target.value)} type="number" className="form-control" id="handicap" placeholder="Enter your handicap" />
                </div>
                <button type="submit" className="btn btn-outline-danger" ><Link to={"/"} >Register</Link></button>
                <button type="button" className="btn btn-outline-danger" ><Link to={"/"} >Back</Link></button>
            </form>
        </div>
    )
}

export default Register