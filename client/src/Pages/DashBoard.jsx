import React from 'react';
import { Link } from 'react-router-dom';

const DashBoard = () => {
    return (
        <div className="bg-gray-900 h-screen w-full flex flex-col justify-center items-center">
            <div className="space-y-4">
                <Link to="/register" className="bg-blue-dark hover:bg-orange-light text-white hover:text-black font-bold py-2 px-4 rounded-full no-underline block text-center transition duration-300 ease-in-out">
                    Register
                </Link>
                <Link to="/login" className="bg-blue-dark hover:bg-orange-light text-white hover:text-black font-bold py-2 px-4 rounded-full no-underline block text-center transition duration-300 ease-in-out">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default DashBoard;
