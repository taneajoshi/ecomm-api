const router = require("express").Router();
const Cart = require("../Modles/Cart");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

//Create CART
router.post("/", verifyToken , async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    }catch(err) {
        res.status(500).json(err);
    }
});

//Update CART
router.put("/:id", verifyTokenAndAuthorization, async (req, res)=>{
   try {
       const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
        $set: req.body 
       }, {new: true}, 
       );
       res.status(200).json(updatedCart);
   }catch (err) {
       res.status(500).json(err);
   }
})

// //DELETE CART
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try { 
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...")
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {  
       const cart = await Cart.findOne({userId: req.body.userId });
       res.status(200).json(cart)
    } catch (err) {
        res.status(500).json(err);
    }
})

// //GET CARTS
router.get("/", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        const cart = cart.find();
    } catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;  