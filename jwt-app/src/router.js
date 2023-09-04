const express = require('express')
const router = express.Router();

const authController = require('../controllers/authController')


router.get('/', (req, res) => {
    res.status(200).json({msg: 'Hello World!'})
    
})

router.get('/user/:id',authController.checkToken, authController.getUserID);

router.post('/auth/login', authController.userLogin);

router.post('/auth/register', authController.userRegister)

module.exports = router;