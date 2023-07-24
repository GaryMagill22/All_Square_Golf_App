import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

const BottomNav = () => {
    return (
        <div>
            <nav className="nav nav-pills flex-column flex-sm-row fixed-bottom">
                <Link className="flex-sm-fill text-sm-center nav-link active btn btn-outline-primary mr-2" to="/home">Home</Link>
                <Link className="flex-sm-fill text-sm-center nav-link btn btn-outline-primary mr-2" to="/profile">Profile</Link>
                <Link className="flex-sm-fill text-sm-center nav-link btn btn-outline-primary mr-2" to="/games">Games</Link>
                <Link className="flex-sm-fill text-sm-center nav-link btn btn-outline-primary mr-2" to="/courses">Courses</Link>
                <Link className="flex-sm-fill text-sm-center nav-link btn btn-outline-primary" to="/rounds">Rounds</Link>
            </nav>
        </div>
    )
}

export default BottomNav;