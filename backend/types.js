import {z} from 'zod'

export const signUpCheck = z.object({
    email:z.string().email(),
    password:z.string().min(3),
    fullname:z.string().min(3).max(30),
    lastname:z.string().min(3).max(30)
})

export const signInCheck = z.object({
    username:z.string().email(),
    password:z.string().min(3),
})

export const updateUserInfo = z.object({
    password:z.string().optional(),
    firstname:z.string().optional(),
    lastname:z.string().optional(),
})

export const validateTransaction = z.object({
    sendTo:z.string(),
    amount:z.number()
    
})