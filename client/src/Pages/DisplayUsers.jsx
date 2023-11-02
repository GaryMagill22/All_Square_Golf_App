import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'



const DisplayUsers = () => {
    const [users, setUsers] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        
        // using environment variables to determine which api to use for local and deployment
        const apiURL = process.env.REACT_APP_API_URL;

        axios.get(`${apiURL}/api/users/allUsers`, { withCredentials: true })
            .then(res => setUsers(res.data))
            .catch(err => {
                console.error("Error fetching users:", err)
            })
    }, [])

    const logoutHandler = () => {

        // using environment variables to determine which api to use for local and deployment
        const apiURL = process.env.REACT_APP_API_URL;

        axios.delete(`${apiURL}/api/users/logout`, { withCredentials: true })
            .then(res => navigate("/"))
            .catch(err => {
                console.error("Error during logout:", err)
            })
    }

    return (
        <div>
            <button onClick={logoutHandler}>Logout</button>

            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>email</td>
                        <td>password</td>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, i) => (
                        <tr key={i}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default DisplayUsers