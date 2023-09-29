const express = require('express')
const router = require('./router')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ["https://auth-project-pi.vercel.app/login", "https://auth-project-pi.vercel.app/register", "https://auth-project-pi.vercel.app/dashboard"]
}))

app.use(express.json())
app.use(router)

const db = process.env.DB_ACESS

mongoose.connect(db)

app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333
})