const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.post('/', async (req, res) => {
    if (!req.body.email) return res.status(400).send('Email not define')
    
    if (!req.body.password) return res.status(400).send('Password not define')

    User.signin({email: req.body.email, password: req.body.password})
        .then(data => {
            res.header('x-auth-token', data.token)
            .header("access-control-expose-headers", "x-auth-token")
            .send(data);
            
        })
        .catch(error => {
        res.status(500).send(error.message)
    })
    
})

module.exports = router