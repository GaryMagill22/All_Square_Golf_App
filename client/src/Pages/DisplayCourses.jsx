import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';



const DisplayCourses = () => {

    return (
        <>
            <nav className="fixed w-full h-16 z-20 top-0 border-b border-salmon-light flex justify-content bg-gray-dark ">
                <div className="flex justify-center mx-auto">
                    <ul className="flex flex-row items-center space-x-4 text-md">
                        <li>
                            <Link to="/home" className="py-2 px-3 text-orange-light no-underline hover:no-underline hover:text-indigo-normal transition-colors bg-gray-normal">Home</Link>
                        </li>
                        <li>
                            <Link to="/profile" className="py-2 px-3 text-orange-light hover:no-underline hover:text-indigo-normal transition-colors bg-gray-normal">Profile</Link>
                        </li>
                        <li>
                            <Link to="/courses" className="py-2 px-3 text-orange-light hover:no-underline hover:text-indigo-normal transition-colors bg-gray-normal">Courses</Link>
                        </li>
                        <li>
                            <Link to="/games" className="py-2 px-3 text-orange-light hover:no-underline hover:text-indigo-normal transition-colors bg-gray-normal">Games</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8 bg-gray-dark min-h-screen">
                <div className="text-center">
                    <p className="text-base font-semibold text-blue-light">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                    <p className="mt-6 text-white leading-7">Sorry, we couldn’t find the page you’re looking for.</p>

                </div>
                <div className="mt-2">
                    <Link to="/home" className="w-9/12 inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-gray-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                        Back
                    </Link>
                </div>
            </main>
        </>
    )



};

export default DisplayCourses;