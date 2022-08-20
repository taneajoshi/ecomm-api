const router = require("express").Router();
const Product = require("../Modles/Product");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

//Create Product
router.post("/", verifyTokenAndAdmin , async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }catch(err) {
        res.status(500).json(err);
    }
});

//Update Product
router.put("/:id", verifyTokenAndAdmin, async (req, res)=>{
   try {
       const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        $set: req.body 
       }, {new: true}, 
       );
       res.status(200).json(updatedProduct);
   }catch (err) {
       res.status(500).json(err);
   }
})

// //DELETE USER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try { 
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...")
    } catch (err) {
        res.status(500).json(err);
    }
})

// //GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {  
       const Product = await Product.findById(req.params.id);
       res.status(200).json(Product)
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    //Query to get latest 5 added users
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {  
        let products;

        if(qNew) {
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory) {
            products = await Product.find({categories:{
                $in: [qCategory],
            }})
        }else {
            products = await Product.find()
        }
       res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;  