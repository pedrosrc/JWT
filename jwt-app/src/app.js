const express = require('express')
const router = require('./router')
const mongoose = require('mongoose')
require('dotenv').config();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();


app.use(express.json())
app.use(router)


const db = process.env.DB_ACESS

mongoose.connect(db)
.then(() => {
    app.listen(3000)
    console.log('Sucess')
})
.catch((error) => {
    console.log(error)
})