const mongoose = require('mongoose')
const { events } = require('./user')

const eventSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
        guestView: Boolean,
    },
    name: {
        type: String,
        required: true,
        guestView: Boolean,
    },
    description: {
        type: String,
        required: true,
        guestView: Boolean,
    },
    location: {
        type: String,
        guestView: Boolean,
    },
    contact: [{
        email: {
            type: String,
            guestView: Boolean,
        },
        phone: {
            type: String,
            guestView: Boolean,
        },
        guestView: Boolean,
    }],
    links: [{
        website: {
            type: String,
            guestView: Boolean,
        },
        social: {
            type: String,
            guestView: Boolean,
        },
        guestView: Boolean,
    }],
    information: {
        type: String,
        guestView: Boolean,
    },
    supplies: {
        type: String,
        guestView: Boolean,
    },
    guidelines: [{
        dress: {
            type: String,
            guestView: Boolean,
        },
        etiquette: {
            type: String,
            guestView: Boolean,
        }, 
        guestView: Boolean,
    }],
    restrictions: {
        type: String,
        guestView: Boolean,
    },
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event