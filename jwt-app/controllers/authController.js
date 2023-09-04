const Auth = require('../models/authModel')
const bcrypt = require('bcrypt')


const getUserID =  async (req, res) => {
        const id = req.params.id
    
        const user = await Auth.findById(id, '-password')
        if(!user){
            return res.status(404).json({msg: 'Usuário não encontrado!'})
        }
}

const userRegister = async(req,res) => {
    const{name, email, password, confirmpassword} = req.body

    if(!name && !email && !password){
        return res.status(422).json({msg: 'Insira os dados corretamente!'})
    }
    if(password !== confirmpassword){
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }

    //Check User Exist
    const userExists = await Auth.findOne({ email: email })

    if(userExists){
        return res.status(422).json({msg: 'Por favor utilize outro email!'})
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
    try{
        await user.save()
        res.status(201).json({msg: 'Usuário criado com sucesso'})
    } catch(error){
        res.status(500).json({msg : 'Aconteceu um erro, tente novamente mais tarde!'})
    }
}


const checkToken = async(req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split("")[1]

    if(!token){
        return res.status(401).json({msg: 'Acesso negado!'})
    }

    try{
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
        
    } catch(error){
        res.status(400).json({msg: 'Token Invalido'})
    }
}


const userLogin = async (req, res) => {
    const{email, password} = req.body

    if(!email && !password){
        return res.status(422).json({msg: 'Insira os dados corretamente!'})
    }
    //Check User Exist
    const user = await Auth.findOne({email: email})
    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }
    //Check Password
    const passwordLogin = await bcrypt.compare(password, user.password)
    if(!passwordLogin){
        return res.status(422).json({msg: 'Senha Incorreta'})
    }

    try{

        res.status(200).json({msg: 'Autenticação Concluída com Sucesso!'})
    } catch(error){
        res.status(400).json({msg: 'Autenticação Negada'})
    }

}

module.exports = {
    getUserID,
    userLogin,
    userRegister,
    checkToken
}