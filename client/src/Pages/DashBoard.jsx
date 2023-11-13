import React from 'react'
import { Link } from 'react-router-dom';




const DashBoard = () => {




    return (

        <div>
            <button  className="" type="button"  ><Link to={"/register"} >Register</Link></button>
            <button  className="" type="button"><Link to={"/login"} >Login</Link></button>
        </div>

    )
}

export default DashBoard


