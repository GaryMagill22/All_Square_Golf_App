import React from 'react'
import { Link } from 'react-router-dom';




const DashBoard = () => {




    return (
        <div className="bg-gray-900" >
            <div className="">
                <button className="bg-sky-500 hover:bg-sky-700 ..." type="button"  ><Link to={"/register"} >Register</Link></button>
                <button className="bg-sky-500 hover:bg-sky-700 ..." type="button"><Link to={"/login"} >Login</Link></button>
            </div>
        </div>

    )
}

export default DashBoard


