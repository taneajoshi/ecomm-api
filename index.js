const express = require("express");
const mongoose = require("mongoose");
const app = express();
//Dot env is used to store and access authentic data in .env file 
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const ProductRoute = require("./routes/product");
const CartRoute = require("./routes/cart");
const OrderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const bodyparser = require("body-parser");

dotenv.config();

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Backend server is running at port 5000");
})

// Rest api end points
// /api/test is a end point so whenver the user will enter this end point it will run the following function. in this case it is "test successful".
// Its not a good practice to add routes here as we can have dozens of routes in our application and it should be organized so we have created a routes folder for organizing the routes.

// app.get("/api/test", ()=>{
//     console.log("test successful");
// })
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.set('view engine', 'ejs');
//For cors policy error.
app.use(cors());
//Here whenever we hit this user route "/api/user" our application will use userRoute.
// To pass any json file ->
app.use(express.json());
app.use("/api/auth", authRoute); 
app.use("/api/users", userRoute);
app.use("/api/products", ProductRoute);
app.use("/api/cart", CartRoute);
app.use("/api/orders", OrderRoute);
app.use("/api/checkout", stripeRoute);

 
//Connecting to mongo server
mongoose.connect(process.env.MONGO_URL
).then(()=>console.log("DB connection successful")).catch((err)=>{
    console.log(err);
});