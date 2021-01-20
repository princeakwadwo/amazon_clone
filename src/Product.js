import React from "react";
import "./Product.css";

function Product({ id, title, price, image, rating }) {
  return (
    <div className="product" key={id}>
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p key={id + i}>🌟</p>
            ))}
        </div>
      </div>
      <img src={image} alt="" />
      <button>Add to Basket</button>
    </div>
  );
}

export default Product;
