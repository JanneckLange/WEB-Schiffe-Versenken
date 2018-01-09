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
      console.log('Player 1 connected');
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
      console.log('Player 2 connected');
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

  //Tausche aktuellen Spieler
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
    let playerSocket;
    let opponentSocket;
    let opponent;
    let nextTurn;

    if (currentPlayer.id === this.player1.id) {
      playerSocket = this.player1Socket;
      opponentSocket = this.player2Socket;
      opponent = this.player2;
      nextTurn = this.player2.id;
    } else {
      playerSocket = this.player2Socket;
      opponentSocket = this.player1Socket;
      opponent = this.player1;
      nextTurn = this.player1.id;
    }
    playerSocket.on('fire', (x, y) => {
      console.log("Fire detected: x:" + x + " y:" + y);
      if (currentPlayer.id === this.turn) {
        if (opponent.field[y][x] == 1) { //Treffer
          playerSocket.emit('fireResult', true);
          opponentSocket.emit('fireResultEnemy', x, y, true);
          opponent.field[y][x] = 2;

          //#####################
          controllLog();
          //#####################

          // TODO: ANFANG (MAX)
          if (_checkShipDown(opponet, x, y)) { //TODO: noch nicht implementiert -> Prüfe ob Schiff an x,y versenkt wurde
            playerSocket.emit('shipDown', x, y); // TODO: noch nicht implementiert -> Muss in "script.js" implementier werden (möglicherweise auch ähnlich implemtieren), Schiff an Stelle x,y wurde versenkt(natürlich auch der rest vom Schiff)
            if (_checkGameOver(opponet)) { // TODO: noch nicht implementiert -> prüfe ob noch '1' auf dem Spielfeld ist
              opponentSocket.emit('lost', player.score); // TODO: noch nicht implementiert -> Muss in "SchiffeVersenken.html"/"script.js" implementier werden
              playerSocket.emit('won', player.score); // TODO: noch nicht implementiert -> Muss in "SchiffeVersenken.html"/"script.js" implementier werden
              _setHighscore(player.name, player.score); // TODO: (BEN) noch nicht implementiert -> Lade Highscore auf den Server
            }
          }
          // TODO: ENDE (MAX)

        } else { //verfehlt
          playerSocket.emit('fireResult', false);
          opponentSocket.emit('fireResultEnemy', x, y, false);
          opponent.field[y][x] = 3;

          //#####################
          controllLog();
          //#####################

          this.turn = nextTurn;
          this._emitTurn();
        }
        if (currentPlayer.id === this.player1.id) {
          this.player1.increaseScore();
        } else {
          this.player2.increaseScore();
        }
      }
    });
  }

  //Test / Controlling
  controllLog() {
    var string1 = "Player1: \n";
    var string2 = "Player2: \n";
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        string1 += this.player1.field[j][i] + " ";
        string2 += this.player2.field[j][i] + " ";
      }
      string1 += "\n";
      string2 += "\n";
    }
    console.log(string1);
    console.log(string2);
  }

  _makeGamePlayable() {
    this.player1Socket.emit('myShips', this.player1.field);
    this.player2Socket.emit('myShips', this.player2.field);
    this._emitTurn();
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