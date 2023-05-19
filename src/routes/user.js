const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const {v4} = require('uuid')
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth')

const router = express.Router()

User.createTable()

router.post('/register', async (req, res) => {

    if (!req.body.firstname) return res.status(400).send('Firstname is not define')
    if (!req.body.lastname) return res.status(400).send('Lastname is not define')
    if (!req.body.gender) return res.status(400).send('Gender is not define')
    if (!req.body.email) return res.status(400).send('Email not define')
    if (!req.body.password) return res.status(400).send('Password not define')
    if(!req.body.address) return res.status(400).send('Address not define')
    if(!req.body.state) return res.status(400).send('State not define')
    if(!req.body.lga) return res.status(400).send('Local Government not define')
    
    
    const userId = v4()
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt)
    const email = req.body.email
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const gender = req.body.gender
    const address = req.body.address
    const state = req.body.state
    const lga = req.body.lga


    User.add({id: userId, email, password, firstname, lastname, gender, address, state, lga})
        .then(user => {
            const token = jwt.sign({ _id: userId}, config.get('jwtPrivateKey'));
            res.header('x-auth-token', token)
            .header("access-control-expose-headers", "x-auth-token")
            .send({token, userId, email, firstname, lastname, gender, address, lga, state});
        })
        .catch(error => {
        res.status(400).send(error.message)
    })

    
    
})


router.get('/userprofile', auth, async (req, res) => {

    User.getUser(req.user._id)
    .then(user => {
        res.send(user)
    })
    .catch(error => {
        res.status(400).send(error.message)
    })
})

router.put('/update', auth, async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const password = req.body.password ? await bcrypt.hash(req.body.password, salt) : ''
    const firstname = req.body.firstname ? req.body.firstname : '' 
    const lastname = req.body.lastname ? req.body.lastname : ''
    const address = req.body.lastname ? req.body.address : '' 



    User.changeProfile({ password, firstname, lastname, address}, req.user._id)
        .then(user => {
            const token = jwt.sign({ _id: req.user._id }, config.get('jwtPrivateKey'));
            res.header('x-auth-token', token).send({token, ...user});
        })
        .catch(error => {
        res.status(500).send(error.message)
    })

    
    
})

module.exports = router

