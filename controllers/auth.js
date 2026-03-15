const express = require('express')
const router = express.Router() 
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs')
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

module.exports = router