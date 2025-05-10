import JWT_SECRET from "./config.js";
import jwt from 'jsonwebtoken'
 

 const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    // console.log("authHeader;",authHeader);
    

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //we are not sending cookies
    if (!authHeader) {

        return res.status(403).json({
            msg:"Invalid Token"
        })
    }

    // const token = authHeader.split(' ')[1]
    const token = authHeader

    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        if (!decoded) {
            return res.status(403).json({
                msg:"Unverified Token"
            })
        }

        if (decoded.userId) {    
            req.userId = decoded.userId
            next()
        }else{
            return res.status(403).json({
                msg:"Something is up"
            })
        }

    } catch (error) {
        console.log('error in middleware',error);
        return res.status(403).json({
            msg:"internal server error "
        })
        
    }
 }

 export default authMiddleware