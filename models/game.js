const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    id: Number,
    board: [{
        word: String,
        color: String,
        discovered: {type: Boolean, default: false},
        team: String,
    }],
    players: [{
        socketId: String,
        pseudo: String,
        team: { type: String, enum: ['blue', 'red'] },
        role: { type: String, enum: ['BS', 'BA', 'RS', 'RA'] },
    }],
    turn: { type: String, enum: ['BS', 'BA', 'N', 'RS', 'RA'], default: 'BS' },
    blueScore: {type: Number, default: 0},
    redScore: {type: Number, default: 0},
    cardsSelected: {type: Array, default: []},
    tip: {
        wordUsed: String,
        number: Number,
    },
    winner: String,
    finished: {type: Boolean, default: false},
    createdAt: {type: Date},
});

gameSchema.index({createdAt: 1},{ expireAfterSeconds: 7200 });

gameSchema.pre("save", function(next) {
    this.createdAt = new Date();
    next();
});

module.exports = mongoose.model('Game', gameSchema );
