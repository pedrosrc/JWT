const express = require('express')
const router = require('./router')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();

const app = express();

app.use(cors({
    origin: "*"
}))
app.use(express.json())
app.use(router)

const db = process.env.DB_ACESS

mongoose.connect(db)
.then(() => {
    app.listen({
        host: '0.0.0.0',
        port: process.env.PORT ?? 3333
        })
})
.catch((error) => {
    console.log(error)
})