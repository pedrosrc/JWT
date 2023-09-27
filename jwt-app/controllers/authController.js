const Auth = require('../models/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const getUserID = async (req, res) => {

    const id = req.userId;
   
    const user = await Auth.findById(id, '-password')
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' })
    }
    res.status(200).json(user)
}

const userRegister = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    if (!name && !email && !password) {
        return res.status(422).json({ msg: 'Insira os dados corretamente!' })
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!' })
    }

    //Check User Exist
    const userExists = await Auth.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({ msg: 'Por favor utilize outro email!' })
    }

    //Create Password Crypt
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Create User
    const user = new Auth({
        name,
        email,
        password: passwordHash
    })
    try {
        await user.save()
        res.status(201).json({ msg: 'Cadastrado com sucesso!' })
    } catch (error) {
        res.status(500).json({ msg: 'Aconteceu um erro, tente novamente mais tarde!' })
    }
}


const checkToken = async (req, res, next) => {
    const authHeader = await req.headers['authorization']
    const token = authHeader 

    if (!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    try {
        const secret = process.env.SECRET

        const decoded = jwt.verify(token, secret)
        const userId = decoded.id  
        req.userId = userId
        next()

    } catch (error) {
        res.status(400).json({ msg: 'Token Invalido'})
    }
}


const userLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email && !password) {
        return res.status(422).json({ msg: 'Insira os dados corretamente!' })
    }
    //Check User Exist
    const user = await Auth.findOne({ email: email })
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' })
    }
    //Check Password
    const passwordLogin = await bcrypt.compare(password, user.password)
    if (!passwordLogin) {
        return res.status(422).json({ msg: 'Senha Incorreta' })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )
        res.status(200).json(token)
    } catch (error) {
        res.status(400).json({ msg: 'Autenticação Negada' })
    }

}

module.exports = {
    getUserID,
    userLogin,
    userRegister,
    checkToken
}