import { Elements } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import CheckoutForm from "../../shared/paymentButton/checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { postPayments } from "../../services/payment";
import { usePaymentProcessingQuery } from "../../features/payment/paymentSlice";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const PaymentPage = ({ programDetailsId }) => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState();
  const stripePromise = loadStripe(
    "pk_test_51QThrEKalAFoHITwOWO9dbQ3kl8kUUfBANhS3U4dNzYvmRsXl8j196jDww2VCJGGehlc7XSBkhagvMVajsoGWfDo00KOCPJQiq"
  );
  console.log(programDetailsId);

  const { data, isLoading, isSuccess } =
    usePaymentProcessingQuery(programDetailsId);

  const appearance = {
    theme: "flat",
  };

  // Pass the appearance object to the Elements instance
  // const elements = stripe.elements({ clientSecret, appearance });

  return (
    <div>
      <p onClick={() => navigate(-1)} className="px-8 py-4 text-[14px] text-font-secondary-black cursor-pointer">
        <span><ChevronLeftIcon /></span>Back</p>
      <div className="p-9">
        {data?.client_secret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: data?.client_secret,
              theme: "stripe",
              loader: "auto",
              appearance: appearance,
            }}
          >
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
