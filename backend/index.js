import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mainRouter from './routes/index.js'

const app = express()

app.use(cors({
    origin:"http://localhost:5173"
}))
app.use(express.json());

dotenv.config()


app.use('/api/v1',mainRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Listening on port: ${PORT}`);
})

