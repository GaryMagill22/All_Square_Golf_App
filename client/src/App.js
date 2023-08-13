import './App.css';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import BottomNav from './Components/BottomNav';
import Home from './Pages/Home';
import GamesPage from './Pages/GamesPage';
import LobbyPage from './Pages/LobbyPage';
import ProfileCard from './Components/ProfileCard';
// import Register from './Pages/Register';
import Cookie from './Pages/Cookie';
import Login from './Pages/Login';
import DashBoard from './Pages/DashBoard';
import DisplayUsers from './Pages/DisplayUsers';
import UserInfo from './Pages/UserInfo';
import ScoreCard from './Components/ScoreCard';
import DisplayRounds from './Pages/DisplayRounds';


function App() {

    // dont need to use Setter for socket
    // const [socket] = useState(() => io(":8000"))

    // useEffect(() => {
    //     console.log("Is this thing on??");
    //     // dont need return unless breaking it down into other components rather than on this file.
    //     return () => socket.disconnect(true);
    // }, [socket])



    return (
        <div className="App">
            <BrowserRouter>
                <p><Link to="/">Test Cookie</Link>|
                    <Link to="/register">Register</Link>|
                    <Link to="/login">Login</Link>|
                    <Link to="/allUsers">All users</Link>|
                    <Link to="/userInfo"> User info</Link>
                </p>
                <Routes>
                    <Route path="/register" element={<Cookie />} />
                    <Route path="/" element={<DashBoard />} />
                    <Route path="/users" element={<Home />} />
                    {/* <Route path="/register" element={<Register />} /> */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/home" element={<BottomNav />} />
                    <Route path="/allUsers" element={<DisplayUsers />} />
                    <Route path="/userInfo" element={<UserInfo />} />

                    <Route path="/games" element={<GamesPage />} />
                    <Route path="/new/round" element={<LobbyPage />} />
                    <Route path="/profile" element={<ProfileCard />} />
                    <Route path="/new/game" element={<ScoreCard />} />
                    <Route path="/rounds" element={<DisplayRounds />} />

                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;