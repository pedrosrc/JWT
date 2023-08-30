const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({msg: 'Hello World!'})
    
})

router.post('/auth/register', async(req,res) => {
    const{name, email, password, confirmpassword} = req.body

    if(!name && !email && !password && !confirmpassword){
        return res.status(422).json({msg: 'Insira os dados corretamente!'})
    }
})

module.exports = router;