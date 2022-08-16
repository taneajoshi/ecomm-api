const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")('sk_test_51LTNGDSGdYqfEdaBQ25b321INDU8Z01XIMyuqKOF5v8qFy835dtXyi8957S5iNBxYQGi2d6TtpmDrpddfFbM6XSb008qinprHz');
// const client_secret = "sk_test_51LTNGDSGdYqfEdaBQ25b321INDU8Z01XIMyuqKOF5v8qFy835dtXyi8957S5iNBxYQGi2d6TtpmDrpddfFbM6XSb008qinprHz";
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

router.post("/payment", async (req, res) => {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
  }, (stripeErr, stripeRes)=> {
    if(stripeErr) {res.status(500).json(stripeErr)}
    else {res.status(200).json(stripeRes)}
  });
})

module.exports = router;  