
const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');

async function userSignInController(req,res){
    try {
        const { email, password } = req.body;

// 🔹 Validate input before querying the database
if (!email) {
    return res.status(400).json({ message: "Please provide email", success: false, error: true });
}
if (!password) {
    return res.status(400).json({ message: "Please provide password", success: false, error: true });
}

// 🔹 Now check if the user exists
const user = await userModel.findOne({ email });
if (!user) {
    return res.status(404).json({ message: "User not found", success: false, error: true });
}
                
        
        const checkPassword = await bcrypt.compare(password,user.password)
        console.log("CheckPassword",checkPassword);
        
        if(checkPassword){
            const tokenData = {
                _id : user._id,
                email : user.email,
            }
            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8});
              
            const tokenOption = {
                httpOnly : true,
                secure : true
            }
            res.cookie("token",token,tokenOption).status(200).json({
                message : "Login successfully",
                data : token,
                success : true,
                error : false
            })
        }else{
            return res.status(401).json({
                message: "Invalid credentials", // More specific message
                success: false,
                error: true,
            });
        }



    } catch (err) {
        res.json({
            message : err.message || err,
            error : true,
            success : false,
        })
    }
}
module.exports = userSignInController