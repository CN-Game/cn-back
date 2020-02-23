const express = require('express');
const router = express.Router();

const words = require('./words.json')
const createGame = require('../services/createGame')

const Game = require('../models/game')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

router.get('/games', function(req, res, next) {

  Game.find(function(err, games) {
    if (err)
      res.send(err);

    res.json(games);
  });

});

router.get('/games/:id', function(req, res, next) {

  const id = req.params.id;

  Game.findOne({id: id}, function(err, game) {
    if (err)
      res.send(err);

    res.json(game);
  });

});

router.post('/games/:id', function(req, res, next) {

  const id = req.params.id;

  Game.findOne({id: id}, function(err, game) {
    if (err)
      res.send(err);

    res.json(game);
  });

});

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
