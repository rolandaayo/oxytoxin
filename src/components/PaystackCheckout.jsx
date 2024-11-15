import React from 'react';
import { usePaystackPayment } from 'react-paystack';

export const PaystackCheckout = ({ amount, email, onSuccess, onClose }) => {
  const config = {
    reference: String(new Date().getTime()),
    email: email,
    amount: Math.round(amount * 100), // Convert to kobo/cents
    publicKey: 'pk_test_your_public_key_here', // Replace with your Paystack public key
    currency: 'NGN',
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <button
      onClick={() => {
        initializePayment(onSuccess, onClose);
      }}
      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
    >
      Pay with Paystack
    </button>
  );
};