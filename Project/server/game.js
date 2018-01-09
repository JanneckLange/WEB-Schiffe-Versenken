const Player = require(__dirname + '/player');

module.exports = class Game {
  constructor() {
    this.player1Socket;
    this.player2Socket;

    this.player1 = new Player('player 1');
    this.player2 = new Player('player 2');

    switch (Math.floor(Math.random() * (1 - 0 + 1)) + 0) {
      case 0:
        this.turn = this.player1.id;
        break;
      case 1:
        this.turn = this.player2.id;
    }
  }
  startGame(socket) {
    console.log('user connected');
    //erster Spieler verbindet
    if (!this.player1Socket) {
      this.player1Socket = socket;
      this.player1Socket.on('disconnect', function() {
        console.log('Player1 hat das Spiel verlassen');
        this.player1Socket = undefined;
      });
      this.player1Socket.on('setPlayerName', playerName => {
        this.player1.name = playerName;
        if (this._isAbleToPlay()) {
          this._refreshNames();
        }
      });
      //zweiter Spieler verbindet
    } else if (!this.player2Socket) {
      this.player2Socket = socket;

      this._makeGamePlayable();
      this._makeFirePossible(this.player1);
      this._makeFirePossible(this.player2);

      this.player2Socket.on('disconnect', () => {
        console.log('Player2 hat das Spiel verlassen');
        this.player2Socket = undefined;
      });
      this.player2Socket.on('setPlayerName', playerName => {
        this.player2.name = playerName;
        if (this._isAbleToPlay()) {
          this._refreshNames();
        }
      });
    }
  }

  //Lege aktuellen Spieler fest
  _emitTurn() {
    if (this.turn == this.player1.id) {
      this.player1Socket.emit('playerTurn', true);
      this.player2Socket.emit('playerTurn', false);
    } else {
      this.player1Socket.emit('playerTurn', false);
      this.player2Socket.emit('playerTurn', true);
    }
  }

  _makeFirePossible(currentPlayer) {

    playerSocket.on('fire', (x, y) => {
      // TODO:
    });
  }

  _makeGamePlayable() {
    this.player1Socket.emit('myShips', this.player1.field);
    this.player2Socket.emit('myShips', this.player2.field);
    this._emitTurn();
  }

  _gameOver() {
    if (!this.player1.ships || !this.player2.ships) {
      return true;
    }
    return (this.player1.allShipsDestroyed() || this.player2.allShipsDestroyed());
  }

  //Benachrichtige Gewinner und Verlierer | aktuallisiere Highscore
  _emitWinnerAndLoser() {
    let winner;
    if (this.player1.allShipsDestroyed()) {
      winner = this.player2;
      this.player2Socket.emit('won', winner.score);
      this.player1Socket.emit('lost', winner.score);
    } else {
      winner = this.player1;
      this.player2Socket.emit('lost', winner.score);
      this.player1Socket.emit('won', winner.score);
    }

    let highscore = new Highscore();
    if (!highscore.readHighscore(highscorePath)) {
      console.log("Error reading from " + highscorePath);
    }
    highscore.addScore(new Score(winner.name, winner.score));
    if (!highscore.writeHighscore(highscorePath)) {
      console.log("Error writing in " + highscorePath);
    }
  }

  _addHit(opponentShips, possibleHit) {
    opponentShips.forEach(ship => {
      ship.addHitCoordinate(possibleHit);
    });
  }

  _markDestroyedShips() {
    this.player1.ships.forEach(ship => {
      if (ship.isDestroyed()) {
        ship.allCoordinates.forEach(coordinate => {
          this.player1Socket.emit('myDestroyedShips', coordinate.xCoordinate, coordinate.yCoordinate);
          this.player2Socket.emit('opponentDestroyedShips', coordinate.xCoordinate, coordinate.yCoordinate);
        });
      }
    });
    this.player2.ships.forEach(ship => {
      if (ship.isDestroyed()) {
        ship.allCoordinates.forEach(coordinate => {
          this.player2Socket.emit('myDestroyedShips', coordinate.xCoordinate, coordinate.yCoordinate);
          this.player1Socket.emit('opponentDestroyedShips', coordinate.xCoordinate, coordinate.yCoordinate);
        });
      }
    });
  }

  //prüfe ob Spiel bereit ist (Spieler sind da und haben einen Namen, Spiel ist nicht vorbei)
  _isAbleToPlay() {
    return this.player1Socket &&
      this.player2Socket &&
      !this._gameOver() &&
      this.player1.name &&
      this.player2.name;
  }

  //übermittle namen des gegenspielers
  _refreshNames() {
    this.player1Socket.emit('refreshName', this.player2.name);
    this.player2Socket.emit('refreshName', this.player1.name);
  }
}