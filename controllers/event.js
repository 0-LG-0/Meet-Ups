const express = require('express')
const router = express.Router() 
const User = require('../models/user')
const Event = require('../models/event')

router.get('/', async (req, res) => {
    try {
        
        const foundEvents = await Event.find()
        res.render('events/index.ejs', { events: foundEvents })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.get('/new', (req, res) => {
    if (req.session.user) {
        const event = req.body
    res.render('events/new.ejs', { event, message: '' })
    }
})

router.post('/new', async (req, res) => {
    try {
    
    const newEvent = await new Event(req.body)
    newEvent.author = req.session.user.username
    await newEvent.save()
        res.redirect('/events/user')
    } catch (error) {
        res.status(500).json({ err: error.message, err: error.stack })
    }
})

router.get('/user', async (req, res) => {
    try {
        const foundEvents = await Event.find()
        const User = req.session.user
        res.render('user/index.ejs', { events: foundEvents, User })
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.get('/:eventId', async (req, res) => {
    try { 
    const foundEvent = await Event.findById(req.params.eventId)
    res.render('events/show.ejs', { event: foundEvent })
    } catch (error) {
        res.status(500).json({ Error: error.message, Error: error.stack })
    }
})
router.get('/user/:eventId', async (req, res) => {
    try { 
    const foundEvent = await Event.findById(req.params.eventId)
        console.log(`Name GuestView ${foundEvent.name.guestView}`)

    res.render('user/show.ejs', { event: foundEvent })
    } catch (error) {
        res.status(500).json({ Error: error.message, Error: error.stack })
    }
})

router.put('/user/:eventId', async (req, res) => {
    try {
        await Event.findByIdAndUpdate(req.params.eventId, req.body)
        res.redirect(`/events/user/${req.params.eventId}`)
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
})

router.delete('/user/:eventId', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.eventId)
        res.redirect('/events/user/')
    } catch (error) {
        res.status(500).json({ Error: error.message })
    }
})

router.get('/user/:eventId/edit', async (req, res) => {
    try { 
        const foundEvent = await Event.findById(req.params.eventId)
        res.render('user/edit.ejs', { event: foundEvent, message: ''})
    } catch (error) {
        res.render('user/edit.ejs', { message: error.message})
    }
})

module.exports = router