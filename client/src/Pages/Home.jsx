import React from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import BottomNav from '../Components/BottomNav';


const Home = () => {
    return (
        <div>
            <div style={{ margin: "20px", gap: "20px" }} className="btn-group-vertical">
                <Link to={"/profile"} type="button" className="btn btn-outline-primary">Profile</Link>
                <Link to={"/games"} type="button" className="btn btn-outline-primary">Games</Link>
                <Link to={"/rounds"} type="button" className="btn btn-outline-primary">Rounds</Link>
                <Link to={"/courses"} type="button" className="btn btn-outline-primary">Courses</Link>
                <Link to={"/new/round"} type="button" className="btn btn-outline-primary">Start a Round</Link>
            </div>

            <BottomNav />
        </div>
    )
}

export default Home


