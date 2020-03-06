const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    id: Number,
    board: [{
        word: String,
        color: String,
        discovered: Boolean,
    }],
    players: [{
        socketId: String,
        pseudo: String,
        team: { type: String, enum: ['blue', 'red'] },
        role: { type: String, enum: ['spy', 'agent'] },
    }]
})

module.exports = mongoose.model('Game', gameSchema )
