const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    id: Number,
    board: [{
        word: String,
        color: String,
        discovered: {type: Boolean, default: false},
    }],
    players: [{
        socketId: String,
        pseudo: String,
        team: { type: String, enum: ['blue', 'red'] },
        role: { type: String, enum: ['BS', 'BA', 'RS', 'RA'] },
    }],
    turn: { type: String, enum: ['BS', 'BA', 'N', 'RS', 'RA'], default: 'BS' }
});

module.exports = mongoose.model('Game', gameSchema );
