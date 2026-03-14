require('dotenv').config() 

const express = require('express')
const app = express()

const morgan = require('morgan')
const methodOverride = require('method-override') 
const session = require('express-session')
const MongoStore = require('connect-mongo')
const syncData = require('./middleware/syncData')

require('./db/connection')
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))

const PORT = process.env.IS_DEV ? 3000 : process.env.PORT

app.get('/', (req, res) => {
    res.render('index.ejs')
})





app.use(syncData)

app.listen(PORT, () => console.log('Running...'))