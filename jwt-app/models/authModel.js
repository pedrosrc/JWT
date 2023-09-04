const mongoose = require('mongoose')

const Auth = mongoose.model('Auth', {
    name: String,
    email: String,
    password: String
})

module.exports = Auth;