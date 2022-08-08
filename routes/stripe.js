const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")('sk_test_51LTNGDSGdYqfEdaBQ25b321INDU8Z01XIMyuqKOF5v8qFy835dtXyi8957S5iNBxYQGi2d6TtpmDrpddfFbM6XSb008qinprHz');

router.get('/pay', function(req, res){
    res.render('Home', {
    key: process.env.STRIPE_PUBLIC_KEY
    })
})

const paymentIntent = await stripe.paymentIntents.create({
  description: 'Software development services',
  shipping: {
    name: 'Jenny Rosen',
    address: {
      line1: '510 Townsend St',
      postal_code: '98140',
      city: 'San Francisco',
      state: 'CA',
      country: 'US',
    },
  },
  amount: 1099,
  currency: 'usd',
  payment_method_types: ['card'],
});
module.exports = router;  