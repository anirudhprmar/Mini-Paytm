import express from 'express'
import { signUpCheck, signInCheck, updateUserInfo } from '../types.js'
import { Account, User } from '../db.js'
import JWT_SECRET from '../config.js'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware.js'

const router = express.Router()

router.post('/signup',async(req,res)=>{ 
 try {
       const validatedData = signUpCheck.safeParse(req.body)

       if (!validatedData.success) {
        return res.status(411).json({
            msg:"invalid inputs"
        })
       }

       const existingUser = await User.findOne({
        email:validatedData.email
       })

       if (existingUser) {
        return res.status(411).json({
            msg:"user already exists"
        })
       }
   
       const dbUser = await User.create({
         email:req.body.email,
         password:req.body.password,
         firstname:req.body.firstname,
         lastname:req.body.lastname
       })

       await Account.create({
        userId:dbUser._id,
        balance: 1 + Math.random() * 10000
       })

       // hash the password using bycrypt

       //const salt =

       const token = jwt.sign({
        userId:dbUser._id
       }, JWT_SECRET)

       // create and send jwt
   
       res.status(200).json({
           msg:"user created successfully",
           token,
           data:dbUser
       })
        
 } catch (error) {
    console.log('error in sign up',error);
    res.status(500).json({
        msg:"Internal server error"
    })
    
 }

})

router.post('/signin',async(req,res)=>{
 try {
       const validatedData = signInCheck.safeParse(req.body)

       if (!validatedData.success) {
        return res.status(411).json({
            msg:"incorrect email or password"
        })
       }
   
       const existingUser = await User.findOne({email:validatedData.email})

       if (!existingUser) {
        return res.status(411).json({
            msg:"user does not exist"
        })
       }

       const token = jwt.sign({userId:validatedData._id},JWT_SECRET)
   
       res.status(200).json({
           status:"login successful",
           token
       })

 } catch (error) {
    console.log('error in sign up',error);
    res.status(500).json({
        msg:"Internal server error"
    })
    
 }

})



router.put('/',authMiddleware,async(req,res)=>{
    try {
        const userInfo = updateUserInfo.safeParse(req.body);

        if (!userInfo.success) {
            return res.status(411).json({
                msg:"invalid inputs"
            })
        }

        await User.updateOne({
            id:req.userId
        })

        res.status(200).json({
            msg:"User updated successfully",

        })
        
    } catch (error) {
        console.log("error in update user info",error);
        return res.status(500).json({
            msg:"Internal server error"
        })
        
    }
})

router.get('/bulk',authMiddleware, async(req,res)=>{
const filter = req.query.filter || '';

const users = await User.find({
    $or: [
        {firstname:{"$regex":filter}},
        {lastname:{"$regex":filter}}
    ]
})

res.json({
    user: users.map(user =>({
        email:user.email,
        firstname:user.firstname,
        lastname:user.lastname,
        _id:user._id
    }))
})

})


export default router