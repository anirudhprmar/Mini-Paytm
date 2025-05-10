import express from 'express'
import authMiddleware from '../middleware.js'
import { Account } from '../db.js'
import mongoose from 'mongoose'
import { validateTransaction } from '../types.js';

const router = express.Router();

router.get('/balance',authMiddleware,async (req,res)=>{
  try {
      const userAccount = await Account.findOne({
          userId:req.userId
      })
  
      res.status(200).json({
          balance: userAccount.balance
      })
  } catch (error) {
    console.log("error in user balance",error);
    res.status(500).json({
        msg:"Internal server error"
    })
  }

})

router.post('/transfer',authMiddleware,async(req,res)=>{
  try {
    const session = await mongoose.startSession();

    session.startTransaction()
      const validatedTransactionInfo = validateTransaction.safeParse(req.body)
  
      // user account checks 
      const userAccount = await Account.findOne({
        userId:req.userId
      }).session(session)

      if (!userAccount || userAccount.balance < validatedTransactionInfo.amount) {
            await session.abortTransaction()

          return res.status(400).json({
              msg:"Insufficient funds"
          })
      }
      
      // another account checks
      const sendingToThisAccount = await Account.findOne({userId:validateTransaction.sentTo}).session(session)
      
       if (!sendingToThisAccount) {
        await session.abortTransaction()

          return res.status(400).json({
              msg:"invalid account"
          })
       }
  
      //performing the transfer

      await Account.updateOne({
        userId:req.userId
      },{
        $inc:{
            balance: -validatedTransactionInfo.amount
        }
      }).session(session)

      await Account.updateOne({
        userId:validatedTransactionInfo.sendTo
      },{
        $inc:{
            balance:validatedTransactionInfo.amount
        }
      }).session(session)
  
      session.commitTransaction()
      
      res.status(200).json({
          msg:"Transfer Successful"
      })

      
  } catch (error) {
    console.log("error in tranfer",error);
    res.status(500).json({
        msg:"internal server error"
    })
  }

})


export default router