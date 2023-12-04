import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const PaymentCheckout = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    localStorage.removeItem('client_secret')

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/verify-payment',
      },
    });


    if (error) {
      setErrorMessage(error.message);
    } else {
      localStorage.removeItem('client_secret')
    }
  };

  return (

      <div className="flex justify-center items-center p-4 border-2 border:bg-gray-dark"> 
        <form onSubmit={handleSubmit}> 
          <PaymentElement />
          <button className="mt-4 bg-maroon-normal text-white font-semibold py-2 px-4 border border-salmon-light rounded-md shadow-sm hover:bg-cyan-normal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon-normal disabled:opacity-50" disabled={!stripe}>
            Complete Payment with Stripe
          </button>
          {errorMessage && <div className="text-red-normal">{errorMessage}</div>}
        </form>
      </div>
  )
};

export default PaymentCheckout;