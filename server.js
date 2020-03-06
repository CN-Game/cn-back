const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const socket = require('./sockets/index')
const indexRouter = require('./routes/index')
const port = process.env.PORT || 3001
require('dotenv').config()

app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api', indexRouter)

const server = require('http').Server(app);

socket(server)

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
  .then( db => {
    console.log( { db: db, url: process.env.MONGO_URL })
  })

server.listen(port)
console.log(`Server listening on port : ${port}`)
