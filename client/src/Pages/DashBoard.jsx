import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/AllSquareLogo-WhiteNoBackground.png';
import golfBallGraphic from '../assets/GolfBallSplash.png';


const DashBoard = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-dark m-0">
                {/* Logo Section */}
                <div className="flex justify-center w-full px-4 pt-6 pb-12">
                    <img className="max-w-full h-auto pt-10" src={logo} alt="All Square Logo" />
                </div>
                {/* Hero Section */}
                <div className="text-center bg-gradient-to-r from-gray-dark to-cyan-normal text-white p-12">
                    <h2 className="text-4xl text-salmon-light font-bold mb-6">Bet. Play. Win.</h2>
                    <p className="text-lg mb-8">Upgrade your golf rounds: Simple Bets, Instant Wins. Challenge friends, track live scores, and ensure every shot matters. Bet directly from your digital wallet and savor speedy payouts. Our app eliminates complexity, focusing on simple scorecards and straightforward betting.</p>
                    <div className="inline-block">
                        <Link to="/register" className="bg-indigo-light text-black hover:no-underline font-medium rounded-lg text-sm px-6 py-2.5 mb-2 block">
                            Get Started
                        </Link>
                        {/* Login button directly below Get Started button */}
                        <Link to="/login" className="bg-gray-normal hover:bg-indigo-light hover:no-underline text-white hover:text-blue-700 font-medium rounded-lg text-sm px-6 py-2.5 block border border-white hover:border-transparent transition duration-300 ease-in-out mt-2">
                            Login
                        </Link>
                    </div>

                </div>
                

            </div>
        </>
    );
};

export default DashBoard;
