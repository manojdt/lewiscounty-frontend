import { Elements } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import CheckoutForm from "../../shared/paymentButton/checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { postPayments } from "../../services/payment";
import { usePaymentProcessingQuery } from "../../features/payment/paymentSlice";
import { useNavigate } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import api from "../../services/api";

const PaymentPage = ({ programDetailsId }) => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState();
  const [data, setData] = React.useState("")
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIP_SECRET_KEY
  );
  const program_id = localStorage.getItem("program_id")
  console.log("program_id ===>", program_id)
  console.log(programDetailsId);

  // const { data, isLoading, isSuccess } =
  //   usePaymentProcessingQuery(program_id);

  const triggerPaymentUrl = async () => {
    const paymentData = await api.post(`/payments/create-payment-intent/${program_id}`)
    setData(paymentData?.data)
  }

  React.useEffect(() => {
    triggerPaymentUrl()
  }, [program_id])

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
