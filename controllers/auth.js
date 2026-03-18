const express = require('express')
const router = express.Router() 
const User = require('../models/user')
const Event = require('../models/event')
const bcrypt = require('bcrypt')

router.get('/events', async (req, res) => {
    try {
        //req.body.guestView = req.body.guestView === 'on' ? true : false
        const foundEvents = await Event.find()
        res.render('events/index.ejs', { events: foundEvents })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

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
    const currentUser = req.session.user
    res.render('auth/sign-out.ejs', { currentUser })
})

router.delete('/profile', async (req, res) => {
    try {
    await User.findByIdAndDelete(req.session.user._id)
    req.session.destroy(() => {
        res.redirect('/')
    })
    
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
})

router.get('/profile', (req, res) => {
    //await User.findById(req.session.user._id)
    res.render('auth/profile.ejs')
})

router.get('/sign-out/confirm', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})


module.exports = router