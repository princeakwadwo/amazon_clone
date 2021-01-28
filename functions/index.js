const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51IE9EOCzj3hyOF23K8zI4K7PwDrNFTrdF95C4Cke8p4VKeZWnV5n6w8K6axQaMxKOr0olk9zDU9N759qtA3k8oWn00iuWH6Co1"
);

// App config
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

//api routes
app.get("/", (req, res) => res.status(200).send("Hello world"));

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  console.log("the total amount is >>>>>>>>>", total);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });
  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
});
//listen
exports.api = functions.https.onRequest(app);

//to run the api: firebase emulators:start and enter
