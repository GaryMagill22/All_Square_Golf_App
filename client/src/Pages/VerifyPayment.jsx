import React from "react";
import { Link } from 'react-router-dom';


export default function VerifyPayment() {
    return (
        <div>
            <div>
                <img src={require("../assets/payment-verify.jpeg")} alt="Verify Payment" />
                <h2>Payment is being verified...Your wallet will be funded once payment is confirmed.</h2>
                <Link to="/home">Go Back Home</Link>
            </div>
        </div>
    )
}
