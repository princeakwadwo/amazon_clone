import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";
import { db } from "./firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState("");
  const [succeeded, setSucceded] = useState(false);
  const [clientSecret, setClientSecret] = useState(false);

  //card for payment:4000058260000005   4242424242424242

  useEffect(() => {
    //generate special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        //stripe expects the total in currencies sub units
        url: `/payment/create?total=${getBasketTotal(basket) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
      console.log(response.data.clientSecret);
    };
    const checkAmount = getBasketTotal(basket);
    if (checkAmount > 0) getClientSecret();
  }, [basket]);

  const handleSubmit = async (event) => {
    //prevent the page from refreshing
    event.preventDefault();
    setProcessing(true);
    console.log("submit scerectkey", clientSecret);
    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then((result) => {
        if (result.error) {
          // Show error to your customer
          console.log(
            "Payment rejected due the following reason:",
            result.error.message
          );
        } else {
          // The payment succeeded! then save orders in db
          paymentCompleted(result.paymentIntent);
        }
      });
  };

  const paymentCompleted = (payinfo) => {
    db.collection("users")
      .doc(user?.uid)
      .collection("orders")
      .doc(payinfo.id)
      .set({
        basket: basket,
        amount: payinfo.amount,
        currency: payinfo.currency,
        created: payinfo.created,
      })
      .then((response) => {
        console.log("Document successfully written!", response);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });

    console.log("payment intent info:", payinfo);
    setSucceded(true);
    setProcessing(false);
    setError(false);
    dispatch({
      type: "EMPTY_BASKET",
    });
    history.replace("/orders"); //to prevent users coming back to payment page
  };

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles,CA</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange}></CardElement>
              <div className="payment__pricecontainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3>Order Total: {value}</h3>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
