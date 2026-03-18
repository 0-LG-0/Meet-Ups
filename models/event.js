const mongoose = require('mongoose')
const { events } = require('./user')

const eventSchema = new mongoose.Schema({
    author: String,
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: String,
    contact: {
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
    },
    links: {
        website: {
            type: String,
        },
        social: {
            type: String,
        },
    },
    information: String,
    supplies: String,
    guidelines: {
        dress: {
            type: String,
            enum: ['Casual', 'Smart Casual', 'Business Casual', 'Business Formal', 'Semi-Formal', 'Formal', 'Black Tie', 'White Tie'],
        },
        etiquette: {
            type: String,
        }, 
    },
    restrictions: String,
})

const Event = mongoose.model('Event', eventSchema)
module.exports = Event