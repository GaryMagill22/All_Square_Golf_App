import './App.css';
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { initSocket } from './helpers/socketHelper';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import Home from './Pages/Home';
import GamesPage from './Pages/GamesPage';
import LobbyPage from './Pages/LobbyPage';
import ProfileCard from './Components/ProfileCard';
import Cookie from './Pages/Cookie';
import Login from './Pages/Login';
import DashBoard from './Pages/DashBoard';
import DisplayUsers from './Pages/DisplayUsers';
import UserInfo from './Components/UserInfo';
import ScoreCard from './Components/ScoreCard';
import DisplayRounds from './Pages/DisplayRounds';
import DisplayCourses from './Pages/DisplayCourses';
import FundWallet from './Pages/FundWallet';
import VerifyPayment from './Pages/VerifyPayment';
import RequestStripeLink from './Pages/RequestStripeAccountLink';
import SelectGameType from './Pages/SelectGameType';


// Creating the context
const AppContext = createContext();


// Context Provider Component
export const AppContextProvider = ({ children }) => {
    const [userInputCourse, setUserInputCourse] = useState('');

    const contextValue = {
        userInputCourse,
        setUserInputCourse,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};


// Custom Hook to access context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};


function App() {

    useEffect(() => {
        initSocket()
    }, []);
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('on app file', isLoggedIn);



    return (
        <AppContextProvider>
            <div className="App">

                <BrowserRouter>
                    <Routes>
                        <Route path="/register" element={<Cookie />} />
                        <Route path="/" element={<DashBoard />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
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
                        <Route path="/new/game/:gameType" element={<ScoreCard />} />
                        <Route path="/rounds" element={<DisplayRounds />} />
                        <Route path="/courses" element={<DisplayCourses />} />
                        <Route path="/new/round/:gameType/:lobbyId" element={<LobbyPage />} />
                        <Route path="/new/round/:lobbyId" element={<LobbyPage />} />
                        <Route path="/fund-wallet/:amount" element={<FundWallet />} />
                        <Route path="/verify-payment" element={<VerifyPayment />} />
                        <Route path="/request-stripe-authlink" element={<RequestStripeLink />} />
                        <Route path="/select-game/:lobbyId" element={<SelectGameType />} />
                    </Routes>
                </BrowserRouter>

            </div>
        </AppContextProvider>
    );
}

export default App;