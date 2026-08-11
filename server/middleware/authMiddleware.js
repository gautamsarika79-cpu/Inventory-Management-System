const jwt=require("jsonwebtoken");
module.exports=(req,res,next)=>{
  const h=req.headers.authorization||"", token=h.startsWith("Bearer ")?h.slice(7):null;
  if(!token)return res.status(401).json({success:false,message:"Authentication required."});
  try{req.user=jwt.verify(token,process.env.JWT_SECRET);next();}
  catch(e){res.status(401).json({success:false,message:"Invalid or expired authentication token."});}
};