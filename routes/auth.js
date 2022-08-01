const router = require("express").Router();
const User = require("../Modles/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res)=> {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt
        (req.body.password, process.env.PASSWORD_SECURED)
        .toString(),
    });  

    try {
        const savedUser = await newUser.save(); 
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN

router.post('/login', async (req,res) => {
    try {
       const user = await User.findOne({ username: req.body.username});
       if (!user)
           return res.status(401).json("wrong email or password");

       const bytes  = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECURED);
       const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
 
       if (originalPassword !== req.body.password)
           return res.status(401).json("wrong email or password");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, 
        process.env.JWT_SECRET_KEY,
        {expiresIn: "3d"}
        );
        //We should not show the password anywhere even if its secured. So we will use spread operator to show all data except the password.
        //Here others could have been named anything
        const {password, ...others} = user._doc;
       res.status(200).json({...others, accessToken});
    }
    catch(err) {
        res.status(500).json({ message: "some internal error occured" });
    }
});

module.exports = router;
 