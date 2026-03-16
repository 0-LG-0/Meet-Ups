const express = require('express')
const router = express.Router() 
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs', { message: '' })
})

router.post('/sign-up', async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body

        const checkUser = await User.findOne({ username: username })

        if (checkUser) {
            throw new Error(`User with username ${username} already exists`)
        }

        if (password !== confirmPassword) {
            throw new Error(`Invalid Password`)
        }

        if (username.charAt(0) !== username.charAt(0).toUpperCase()) {
            throw new Error(`The first letter in ${username} must be capitalized`)
        }

        const hashedPassword = bcrypt.hashSync(password, 8)
        const user = await User.create({
            username,
            hashedPassword,
        })
        req.session.user = {
            _id: user._id, 
            username: user.username,
        }

        req.session.save(() => {
            res.redirect('/')
        })
    } catch (error) {
        res.render('auth/sign-up.ejs', { message: error.message })
    }
})

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs', { message: '' })
})

router.post('/sign-in', async (req,res) => {
    const { username, password } = req.body 
    try {
       
        const checkUser = await User.findOne({ username })
        if (!checkUser) {
            throw new Error (`Invalid Username ${username}`)
        }
        const checkPassword = bcrypt.compareSync(password, checkUser.hashedPassword)
        if (!checkPassword) {
            throw new Error('Invalid Password')
        }
        req.session.user = {
            _id: checkUser._id,
            username: checkUser.username,
        }
        req.session.save(()=> {
            res.redirect('/')
        })
    } catch (error) {
        res.render('auth/sign-in.ejs', { message: error.message })
    }
})

router.get('/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

module.exports = router