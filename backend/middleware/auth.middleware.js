import pkg from 'jsonwebtoken';
const { jwt } = pkg;
import User from "../models/user.model.js";
export const protectRoute = async (req,res,next)=>{
try {
    const accessToken = req.cookies["access-token"];
    if(!accessToken){
        return res.status(400).json({message:"access token not present"});
    }
    try {
        const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById({user : decode.userId}).select("-password");
    if(!user){
        return res.status(401).json({message:"User not found"});
    }
    req.user = user;
    next();
    } catch (error) {
        if(error.name ==="TokenExpiredError"){
            return res.status(401).json({message:"Access token expired"});
        }
        else{
            throw error;
        }
    }
} catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(401).json({message:"Unauthorised"});
}
}

export const adminRoute =(req,res,next)=>{
    if(req.user && req.user.role ==="admin"){
        next();
    }
    else{
        return res.status(403).json({message:"Access denied"});
    }
}