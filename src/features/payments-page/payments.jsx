import { Elements } from '@stripe/react-stripe-js';
import React from 'react';
import CheckoutForm from '../../shared/paymentButton/checkout-form';
import { loadStripe } from '@stripe/stripe-js';

const PaymentPage = ({ clientSecret }) => {
  const stripePromise = loadStripe(
    'pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3'
  );
  console.log(clientSecret);
  return (
    <>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: clientSecret,
            theme: 'stripe',
            loader: 'auto',
          }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
};

export default PaymentPage;
