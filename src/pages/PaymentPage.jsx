import { useLoaderData } from "react-router";
import CheckoutForm from "../components/paymentPage/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderDetails from "../components/paymentPage/OrderDetails";

const PaymentPage = () => {
  const data = useLoaderData();
  const stripePromise = loadStripe(import.meta.env.VITE_stripePK);

  return (
    <main className="container mx-auto mb-12 md:mb-16 px-4 md:px-0">
      <div className="flex flex-col lg:flex-row gap-8">
        <OrderDetails data={data} />
        <div className="lg:w-2/5">
          <Elements stripe={stripePromise}>
            <CheckoutForm data={data} />
          </Elements>
        </div>
      </div>
    </main>
  );
};

export default PaymentPage;
