import User from "../models/user.model.js";
import  { jwt } from 'jsonwebtoken';
import dotenv from "dotenv";
import { redis } from "../lib/redis.js";

const generateTokens=(userId)=>{
  const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
  const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{expiresIn :"7d"});
  return {accessToken, refreshToken};
}

const storeRefreshToken = async(userId, refreshToken)=>{
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60 );
}

const setCookies = async (res,accessToken,refreshToken)=>{
  res.cookie("access-token",accessToken,{
    httpOnly : true,
    secure:process.env.NODE_ENV ==="production" ?true:false ,
    sameSite:"strict",
    maxAge :15*60*1000 });
  res.cookie("refresh-token",refreshToken,{
    httpOnly : true,
    secure:process.env.NODE_ENV !=="production"?true:false,
    sameSite:"strict",
    maxAge :7*24*60*60*1000  })//ms
    console.log('Set-Cookie:', res.getHeaders()['set-cookie']);
}

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exits" });
    }
    const user = await User.create({ name, email, password });
    // const userObj = user.toObject();
    // authentication - jwt and redis data base
    // generate tokens
    const {accessToken,refreshToken} = generateTokens(user._id);

    await storeRefreshToken(user._id,refreshToken);

    await setCookies(res,accessToken,refreshToken);
    // await setCookies(res,refreshToken);

    console.log("User created successfully");
    return res.status(201).json({ user: {
      _id:user._id,
      name:user.name,
      email:user.email,
      role:user.role},message: "Saved"});
  } 
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && await user.comparePassword(password)){
      const {accessToken,refreshToken} = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res,accessToken,refreshToken);

      res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
      })
    };
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};

export const logout = async (req, res) => {
 try {
  const refreshToken = req.cookies["refresh-token"];
    if(refreshToken){
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decode.userId}`);
    }
    res.clearCookie("refresh-token");
    res.clearCookie("access-token");
    res.json({message:"Loggged Out Successfully"});
 } catch (error) {
    res.status(500).json({message:error.message});
 }
};

export const refreshToken = async(req,res) =>{
  try {
    const refreshToken = req.cookies["refresh-token"];
    if(!refreshToken){
      return res.status(401).json({message:"No refresh Token provided"});
    }
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decode.userId}`);
    if(storedToken!= refreshToken){
      return res.status(401).json({message:"Invalid Refresh Token"});
    }

    // generate new access
    const accessToken = jwt.sign({userId: decode.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
    res.cookie("access-token",accessToken,{
      httpOnly : true,
      secure:process.env.NODE_ENV ==="production" ?true:false ,
      sameSite:"strict",
      maxAge :15*60*1000 });
      res.json({message:"Access Token generated"});
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};


// export const getProfile = async(req,res) =>{

// }