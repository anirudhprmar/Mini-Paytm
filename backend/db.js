import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGO_URI)

const userSchema = mongoose.Schema({
    email:String,
    password:String,
    firstname:String,
    lastname:String
})


const accountSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{   
        type:Number,
        required:true
    }
})

export const Account = mongoose.model("Account",accountSchema)
export const User = mongoose.model("User",userSchema)