require('dotenv').config() 


const express = require('express')
const app = express()

const morgan = require('morgan')
const methodOverride = require('method-override') 
const session = require('express-session')
const MongoStore = require('connect-mongo')

const authRoutes = require('./controllers/auth')
const eventRoutes = require('./controllers/event')

const syncData = require('./middleware/syncData')
const authorization = require('./middleware/userAuth')
const PORT = process.env.IS_DEV ? 3000 : process.env.PORT

require('./db/connection')
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(syncData)

app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user
    })
})


app.use('/', authRoutes)
app.use(authorization) 
app.use('/events', eventRoutes)



app.listen(PORT, () => console.log('Running...'))