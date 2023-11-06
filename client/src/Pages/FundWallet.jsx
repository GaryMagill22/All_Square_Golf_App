import React from 'react';
import { useParams } from 'react-router-dom';
import PaymentCheckout from '../Components/PaymentCheckout';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


// public Key
const stripePromise = loadStripe('pk_test_51NpbUBHJaZP62m3KKuApJPp7c67kL8vOpxwCr4ZDVxgDE1c01CpnNqSNbURSEzKnyGTOEtVLOV38NOq3pRDY29Px00WnKFvNsV');

const FundWallet = () => {
  const { amount } = useParams();
  const clientSecret = localStorage.getItem('client_secret');

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <div className='stripePaymentContainer ml-4 mr-4'>
        <Elements stripe={stripePromise} options={options}>
          <h3 className='payment-details'>Fund ${Math.ceil(amount)} into your wallet</h3>
          {
            clientSecret ?
              <PaymentCheckout /> :
              <h3>Something went wrong</h3>
          }
        </Elements>
      </div>
    </div>
  )
}

export default FundWallet;