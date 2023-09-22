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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className='main-button mt-4 btn btn-primary' disabled={!stripe}>Complete Payment with Stripe</button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  )
};

export default PaymentCheckout;