import JWT_SECRET from "./config";
import jwt from 'jsonwebtoken'
 

 const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({})
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(JWT_SECRET)
        if (!decoded) {
            return res.status(403).json({
                msg:"Unverified Token"
            })
        }

        if (decoded.userId) {    
            req.userId = decoded.userId
            next()
        }else{
            return res.status(403).json({})
        }

    } catch (error) {
        console.log('error in middleware',error);
        return res.status(403).json({
            msg:"internal server error "
        })
        
    }
 }

 export default authMiddleware