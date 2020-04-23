const Game = require('../models/game')

function socket (server) {
  const io = require('socket.io')(server);

  io.on('connection', function (socket) {

    const room = socket.handshake.query.room;
    let cardsSelected = [];

    socket.join(room);

    socket.on('New user connected', function(msg){
      io.to(room).emit('UPDATE_CLIENT', msg);
    });

    socket.on('Choose team', async function (data) {

      const game = await Game.findOneAndUpdate(
        {id:room, "players.socketId": socket.id},
        {"players.$.role": data.role, "players.$.team": data.team},
        { new: true }
      );

      // console.log(game);

      io.to(room).emit('UPDATE_CLIENT')
    });

    socket.on('GAME_BEGIN', () => {
      console.log('The game begin')
      io.to(room).emit('GO_TO_GAME');
    });

    const _setFinished = (game, winner) => {
      game.finished = true;
      game.winner = winner;
    };

    socket.on('NEXT_TURN', async (data) => {
      await Game.findOneAndUpdate(
            {id:room},
            {turn: data.toNextTurn}
          );

      if (data.toNextTurn === 'BS' || data.toNextTurn === 'RS') {
        for (const card of cardsSelected) {
          await Game.findOneAndUpdate(
              {id:room, "board._id": card._id},
              {"board.$.discovered": true},
              { new: true }
          );
        }
        let blueScore = 0;
        let redScore = 0;
        Game.findOne({id: room}, function(err, game) {
          console.log(game);
          game.board.forEach( card => {
            if (card.team === "blue" && card.discovered) {
              blueScore++;
            } else if (card.team === "red" && card.discovered) {
              redScore++;
            } else if (card.team === "black" && card.discovered) {
              switch (data.toNextTurn) {
                case 'BS':
                  _setFinished(game, 'blue')
                  break;
                case 'RS':
                  _setFinished(game, 'red')
                  break
              }
            }
          });
          if (blueScore === 7 && !game.finished){
            _setFinished(game, 'blue')
          }
          if (redScore === 7 && !game.finished){
            _setFinished(game, 'red')
          }

          game.blueScore = blueScore;
          game.redScore = redScore;
          game.save()
        });
      }
      cardsSelected = [];
      io.to(room).emit('CARDS_SELECT_UPDATE', cardsSelected);
      io.to(room).emit('NEXT_TURN', data)
    });

    socket.on('SELECT_CARD', async (data) => {
      const {item, turn, player} = data;

      if ((turn === 'BA' && player.role === 'BA') || (turn === 'RA' && player.role === 'RA')) {
        if (cardsSelected.some(card => card._id === item._id)) {
          cardsSelected = cardsSelected.filter(card => card._id !== item._id)
        } else {
          cardsSelected.push(item);
        }
      }

      io.to(room).emit('CARDS_SELECT_UPDATE', cardsSelected)
    });



    socket.on('disconnect', () => {
      Game.update(
        { id: room, "players.socketId": socket.id },
        {
          "$pull": {
            "players": { "socketId": socket.id }
          }
        },
        {}
        ,
        function (err, game) {
          console.log(socket.id)
          console.log('Disconnect: ', game)
        }
      );

      socket.broadcast.to(room).emit('user_leave', {user_name: socket.id});
      io.to(room).emit('Update client');
    });

  });
}

module.exports = socket;
