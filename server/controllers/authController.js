const bcrypt=require("bcryptjs"),jwt=require("jsonwebtoken");
const {User}=require("../models");
const token=u=>jwt.sign({id:u.id,email:u.email},process.env.JWT_SECRET,{expiresIn:"2h"});
exports.register=async(req,res,next)=>{try{
 const {name,email,password}=req.body;
 if(!name?.trim())return res.status(400).json({success:false,message:"Full name is required."});
 if(!email?.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({success:false,message:"A valid email address is required."});
 if(!password||password.length<8)return res.status(400).json({success:false,message:"Password must be at least 8 characters."});
 const exists=await User.findOne({where:{email:email.toLowerCase().trim()}});
 if(exists)return res.status(409).json({success:false,message:"An account with this email already exists."});
 const u=await User.create({name:name.trim(),email:email.toLowerCase().trim(),password:await bcrypt.hash(password,12)});
 res.status(201).json({success:true,message:"Account created successfully.",token:token(u),user:{id:u.id,name:u.name,email:u.email}});
}catch(e){next(e)}};
exports.login=async(req,res,next)=>{try{
 const {email,password}=req.body;
 const u=await User.findOne({where:{email:(email||"").toLowerCase().trim()}});
 if(!u||!(await bcrypt.compare(password||"",u.password)))return res.status(401).json({success:false,message:"Invalid email or password."});
 res.json({success:true,message:"Login successful.",token:token(u),user:{id:u.id,name:u.name,email:u.email}});
}catch(e){next(e)}};
exports.me=async(req,res,next)=>{try{
 const u=await User.findByPk(req.user.id,{attributes:["id","name","email","createdAt"]});
 if(!u)return res.status(404).json({success:false,message:"User account not found."});
 res.json({success:true,user:u});
}catch(e){next(e)}};