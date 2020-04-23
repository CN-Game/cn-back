const express = require('express');
const router = express.Router();

const words = require('./words.json')
const createGame = require('../services/createGame')

const Game = require('../models/game')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Welcome' });
});

// Get all games
router.get('/games', function(req, res, next) {

  Game.find(function(err, games) {
    if (err)
      res.send(err);

    res.json(games);
  });

});

// Get one Game by ID
router.get('/games/:id', function(req, res, next) {

  const id = req.params.id;

  Game.findOne({id: id}, function(err, game) {
    if (err)
      res.send(err);

    if (game) {
      console.log(200);
      res.status(200).json(game);
    } else {
      console.log(404);
      res.status(404).json('No game found');
    }
  });

});

// Update Game
router.post('/games/:id', function(req, res, next) {

  const id = req.params.id;
  const { pseudo, socketId } = req.body;

  Game.findOne({id: id}, function(err, game) {
    if (err)
      res.send(err);

    game.players.push({ pseudo, socketId })

    game.save(function(err) {
      if (err)
        res.send(err);

      res.send('Updated')
    });
  });

});

// Create Game
router.post('/games', function(req, res, next) {

  const gameId = Math.floor(100000 + Math.random() * 900000)

  const game = new Game();

  game.id = gameId;
  game.board = createGame(words);

  game.save(function(err) {
    if (err)
      res.send(err);

    res.json({ gameId: gameId });
  });
});

module.exports = router;
