import React from 'react'
import { Link } from 'react-router-dom';




const DashBoard = () => {




    return (

        <div>
            <button type="button" className="btn btn-outline-danger" ><Link to={"/register"} >Register</Link></button>
            <button type="button" className="btn btn-outline-danger" ><Link to={"/login"} >Login</Link></button>
        </div>

    )
}

export default DashBoard


