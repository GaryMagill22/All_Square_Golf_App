import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';



const LoginRegister = (props) => {
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [handicap, setHandicap] = useState('');














    return (
        <div>
            <div className="container" style={{ maxWidth: '500px' }}>
                <h2>Login/Register</h2>
                <form >
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">First Name: </label>
                        <input onChange={(e) => setFirstName()} type="text" className="form-control" id="firstName" placeholder="Enter your first name" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name: </label>
                        <input onChange={(e) => setLastName(e.target.value)} type="text" className="form-control" id="lastName" placeholder="Enter your last name" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username: </label>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" id="username" placeholder="Enter a username" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email: </label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder="Enter your email" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password: </label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Enter a password" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="handicap" className="form-label">Handicap: </label>
                        <input onChange={(e) => setHandicap(e.target.value)} type="number" className="form-control" id="handicap" placeholder="Enter your handicap" />
                    </div>

                    <button className="btn btn-outline-primary"><Link to={"/home"} >Register/Login:</Link> </button>
                </form>
            </div>
        </div>
    )
}

export default LoginRegister