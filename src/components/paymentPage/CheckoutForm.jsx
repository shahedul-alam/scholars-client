import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router";
import axios from "axios";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({ data }) => {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { user, dbUser, successToast, errorToast } = useAuth();
  const navigate = useNavigate();
  const {id} = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();

  const { applicationFees, serviceCharge } = data;
  const totalPrice = applicationFees + serviceCharge;

  useEffect(() => {
    axiosSecure
      .post("/create-payment-intent", { price: totalPrice })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      });
  }, [axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setError(error.message);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setError("");
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      errorToast(confirmError);
    } else {
      if (paymentIntent.status === "succeeded") {
        const paymentDetails = {
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentDate: new Date(),
          scholarshipId: id,
          userId: dbUser._id,
        };
        
        successToast("Your payment was successful!");

        axios.post("http://localhost:5000/payment", paymentDetails)
        .then((res) => navigate(`/applications/${paymentIntent.id}/apply`));
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 bg-white shadow-md rounded-2xl space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Secure Payment
      </h2>

      <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className="w-full btn bg-orange text-white font-semibold"
      >
        Pay Now
      </button>
      {error && <p className="text-error">{error}</p>}
    </form>
  );
};

export default CheckoutForm;
