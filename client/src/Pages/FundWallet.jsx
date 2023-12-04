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
    <div  >
      <div className='stripePaymentContainer ml-4 mr-4 pt-8'>
        <Elements stripe={stripePromise} options={options}>
          <h2 className='payment-details text-black font-bold text-2xl mb-4'>Deposit ${Math.ceil(amount)} into your <br></br> All-Square wallet</h2>
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