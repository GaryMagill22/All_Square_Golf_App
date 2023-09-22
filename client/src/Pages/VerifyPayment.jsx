import React from "react";

export default function VerifyPayment() {
    return (
        <div>
            <div>
                <img src={require("../assets/payment-verify.jpeg")} alt="Verify Payment" />
                <h2>Payment is being verified...Your wallet will be funded once payment is confirmed.</h2>
                <a href="/home">Go Back Home</a>
            </div>
        </div>
    )
}