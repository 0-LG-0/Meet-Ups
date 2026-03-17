const express = require('express')
const router = express.Router() 
const User = require('../models/user')
const Event = require('../models/event')

router.get('/', async (req, res) => {
    try {
        //req.body.guestView = req.body.guestView === 'on' ? true : false
        const foundEvents = await Event.find()
        res.render('events/index.ejs', { events: foundEvents })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.get('/new', (req, res) => {
    if (req.session.user) {
    res.render('events/new.ejs', { message: '' })
    }
})

router.post('/new', async (req, res) => {
    try {
    req.body.guestView = req.body.guestView === 'on' ? true : false
    const newEvent = await new Event(req.body)
    newEvent.author = req.session.user.username
    await newEvent.save()
        res.redirect('/')
    } catch (error) {
        res.status(500).json({ err: error.message, err: error.stack })
    }
})

router.get('/:eventId', async (req, res) => {
    try { 
    ///req.body.guestView = req.body.guestView === 'on' ? true : false
    const foundEvent = await Event.findById(req.params.eventId)
    res.render('events/show.ejs', { event: foundEvent })
    } catch (error) {
        res.status(500).json({ Error: error.message, Error: error.stack })
    }
})

router.get('/user', async (req, res) => {
    try {
        //req.body.guestView = req.body.guestView === 'on' ? true : false 
        const foundEvents = await Event.find()
        if (foundEvents.author == req.session.user.username) {
        res.render('events/user/index.ejs', { events: foundEvents })
        }
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

module.exports = router