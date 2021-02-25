import React from "react";
import "./Order.css";
import moment from "moment";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";

// {moment.unix(order.data.created, "DD MMMM YYYY,h:mmm")} moment.unix(timestamp).format('MMM Do YYYY @ h:mm a')
function Order({ order }) {
  return (
    <div className="order">
      <h2>Order</h2>
      <p>
        {moment
          .unix(order.data.created)
          .format("dddd, MMMM Do YYYY, h:mm:ss a")}
      </p>
      <p className="order__id">
        <small>{order.id}</small>
      </p>
      {order.data.basket?.map((item,key) => (
        <CheckoutProduct
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          rating={item.rating}
          hideButton={true}
        />
      ))}
      <CurrencyFormat
        renderText={(value) => (
          <>
            <h3 className="order__total">Order Total :{value}</h3>
          </>
        )}
        decimalScale={2}
        value={order.data.amount / 100}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
    </div>
  );
}

export default Order;
