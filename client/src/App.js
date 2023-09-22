import './App.css';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { initSocket } from './helpers/socketHelper';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import BottomNav from './Components/BottomNav';
import Home from './Pages/Home';
import GamesPage from './Pages/GamesPage';
import LobbyPage from './Pages/LobbyPage';
import ProfileCard from './Components/ProfileCard';
import Register from './Pages/Register';
import Cookie from './Pages/Cookie';
import Login from './Pages/Login';
import DashBoard from './Pages/DashBoard';
import DisplayUsers from './Pages/DisplayUsers';
import UserInfo from './Components/UserInfo';
import ScoreCard from './Components/ScoreCard';
import DisplayRounds from './Pages/DisplayRounds';
import FundWallet from './Pages/FundWallet';
import VerifyPayment from './Pages/VerifyPayment';
import RequestStripeLink from './Pages/RequestStripeAccountLink';
import Chat from './Components/Chat';
import AppContext from './helpers/context';


function App() {

    useEffect(() => {
        initSocket()
    }, [])
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('on app file', isLoggedIn);
    return (
        <div className="App">

            <BrowserRouter>
                <p><Link to="/">Test Cookie</Link>|
                    <Link to="/register">Register</Link>|
                    <Link to="/login">Login</Link>|
                    <Link to="/allUsers">All users</Link>|
                    <Link to="/userInfo"> User info</Link>
                </p>
                <AppContext.Provider>
                    <Routes>
                        <Route path="/register" element={<Cookie />} />
                        <Route path="/" element={<DashBoard />} />
                        {/* <Route
                        path="/users"
                        element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <Home />
                            </ProtectedRoute>
                        }
                    /> */}
                        {/* <Route path="/register" element={<Register />} /> */}
                        <Route path="/login" element={<Login />} />
                        {/* <Route path="/home" element={<Button />} /> */}
                        {/* <Route path="/home" element={<Home />} /> */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        {/* <Route path="/home" element={<BottomNav />} /> */}
                        <Route
                            path="/allUsers"
                            element={
                                <ProtectedRoute>
                                    <DisplayUsers />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/userInfo" element={<UserInfo />} />
                        {/* <Route path="/new/game" element={<Chat />} /> */}
                        <Route path="/games" element={<GamesPage />} />
                        <Route path="/profile" element={<ProfileCard />} />
                        <Route path="/new/game" element={<ScoreCard />} />
                        <Route path="/rounds" element={<DisplayRounds />} />
                        <Route path="/new/round/:lobbyId" element={<LobbyPage />} />
                        <Route path="/fund-wallet/:amount" element={<FundWallet />} />
                        <Route path="/verify-payment" element={<VerifyPayment />} />
                        <Route path="/request-stripe-authlink" element={<RequestStripeLink />} />
                    </Routes>
                </AppContext.Provider>
            </BrowserRouter>

        </div>
    );
}

export default App;