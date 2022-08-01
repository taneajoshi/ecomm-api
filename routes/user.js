const router = require("express").Router();
const User = require("../Modles/User");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken");

router.put("/:id", verifyTokenAndAuthorization, async (req, res)=>{
   if(req.body.password) {
       req.body.password = CryptoJS.AES.encrypt(
           req.body.password,
           process.env.PASSWORD_SECURED
       ).toString();  
   }

   try {
       const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body 
       }, {new: true}, 
       );
       res.status(200).json(updatedUser);
   }catch (err) {
       res.status(500).json(err);
   }
})

//DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try { 
        await User.findByIdAndDelete (req.params.id);
        res.status(200).json("User has been deleted...")
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {  
       const user = await User.findById(req.params.id);
       const {password, ...others} = user._doc;
       res.status(200).json(others)
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    //Query to get latest 5 added users
    const query = req.query.new
    try {  
       const users = query ? await User.find().sort({_id: -1}).limit(2): await User.find();
       res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err);
    }
})


//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    //This gives todays date
    const date = new Date();
    //This give last one year from todays date
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {  
       const data = await User.aggregate([
           {
               //Condition
               $match: {createdAt: {$gte: lastYear}}
           },
           {
               $project: {
                   month: { $month: "$createdAt"},
               },
           },
           {
               $group: {
                   _id: "$month",
                   total: {$sum: 1}
               }
           }
       ]);
       res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;  