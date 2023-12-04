import React from "react";
import { Link } from 'react-router-dom';
import paymentVerifyImage from "../assets/payment-verify.jpeg";





export default function VerifyPayment() {
    return (
        <div >
            <div>
                <img src={paymentVerifyImage} alt="Verify Payment" />
                <h2>Payment is verified - Deposit successful! Return to Profile to see funds.</h2>
                <Link to="/profile" className="w-40 inline-flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-cyan-normal hover:bg-indigo-dark hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                    Profile
                </Link>
                <Link to="/home" className="w-40 inline-flex justify-center mt-4 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-indigo-dark hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                    Home
                </Link>
            </div>
        </div>
    )
}