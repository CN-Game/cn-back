const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())

var server = require('http').Server(app);


// SOCKET IO
const io = require('socket.io')(server);

io.on('connection', function (socket) {

  const room = socket.handshake.query.room

  socket.join(room)

  // io.to(room).emit('chat message', `I'm new here: ${room}`)

  socket.on('welcome', function(msg){
    console.log(msg)

    socket.broadcast.to(room).emit('chat message', msg);
  });

});

// SOCKET IO END

const port = process.env.PORT || 3001

const indexRouter = require('./routes/index')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api', indexRouter)

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
  .then( db => {
    console.log( { db: db, url: process.env.MONGO_URL })
  })

server.listen(port)
console.log(`Server listening on port : ${port}`)
