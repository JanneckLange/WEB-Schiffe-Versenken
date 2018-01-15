const Player = require(__dirname + '/player');
const Highscore = require(__dirname + '/highscore');

module.exports = class Game {

  constructor(name) {
    //Verbindung zum Spieler
    this.player1Socket;
    this.player2Socket;

    this._name = name;

    this._gameOver = true;

    //Daten des Spielers
    this.player1;
    this.player2;
  }

  set gameOver(gameOver) {
    this._gameOver = gameOver;
  }
  get name() {
    return this._name;
  }

  /**
   * Startet das Spiel, sobald eine Verbindung zum Server aufgebaut wurde.
   * @param {any} socket
   */
  startGame(socket) {
    var _checkDown = function(x, y, field) {

      var result = true;
      var ind = Number(x) + 1;

      for (let i = 0; i < 5; i++) {
        if (ind >= 0 && ind <= 9) {
          if (field[y][ind] == 0) {
            i = 5;
          }
          if (field[y][ind] == 3) {
            i = 5;
          }
          if (field[y][ind] == 1) {
            result = false;
          } else {
            ind++;
          }
        }
      }

      ind = Number(x) - 1;
      for (let i = 0; i < 5; i++) {
        if (ind >= 0 && ind <= 9) {
          if (field[y][ind] == 0) {
            i = 5;
          }
          if (field[y][ind] == 3) {
            i = 5;
          }
          if (field[y][ind] == 1) {
            result = false;
          } else {
            ind--;
          }
        }
      }

      ind = Number(y) + 1;
      for (let i = 0; i < 5; i++) {
        if (ind >= 0 && ind <= 9) {
          if (field[ind][x] == 0) {
            i = 5;
          }
          if (field[ind][x] == 3) {
            i = 5;
          }
          if (field[ind][x] == 1) {
            result = false;
          } else {
            ind++;
          }
        }
      }

      ind = Number(y) - 1;
      for (let i = 0; i < 5; i++) {
        if (ind >= 0 && ind <= 9) {
          if (field[ind][x] == 0) {
            i = 5;
          }
          if (field[ind][x] == 3) {
            i = 5;
          }
          if (field[ind][x] == 1) {
            result = false;
          } else {
            ind--;
          }
        }
      }

      console.log("_checkDown return " + result);
      return result;
    }; // _checkDown Ende
    var _checkWin = function(field) {
      var result = true;

      for (var i = 0; i < 10; i++) {
        for (var k = 0; k < 10; k++) {

          if (field[k][i] == 1) {
            result = false;
          }
        }
      }
      console.log("_checkWin return " + result);
      return result;
    }; // _checkDown
    var _gameOver = function(playerSocket, opponentSocket, currentPlayer, opponent, Game) {
      Game.gameOver = true;
      playerSocket.emit('won', currentPlayer.score);
      opponentSocket.emit('lost', currentPlayer.score, currentPlayer.field);
      console.log("win: " + currentPlayer.name + ", score: " + currentPlayer.score);
      Highscore.updateScore(currentPlayer.score, currentPlayer.name); // Gewinner-Score an Highscore updaten
      console.log("Socket: " + Game.player1Socket);
      Game.player1Socket = undefined;
      Game.player2Socket = undefined;
      console.log("GameOver, Spiel zurückgesetzt.");
      console.log("______________________________________________________________________");
    };

    console.log('user connected');

    if (!this.player1Socket) { // erster Spieler verbindet
      console.log('Player 1 connected');
      this.player1Socket = socket;
      this.player1Socket.emit('title', this._name);
      socket.emit('msg', "Tada.");

      this.player1 = new Player('player 1');

      this.player1Socket.on('disconnect', () => {
        console.log('Player1 hat das Spiel verlassen');
        this.player1Socket = undefined;
        if (this.player2Socket) {
          this.player2Socket.emit('enemyDisconnect');
        }
      });

      this.player1Socket.on('setPlayerName', playerName => {
        this.player1.name = playerName;
        if (this._isAbleToPlay()) {
          this._refreshNames();
        }
      });

    } else if (!this.player2Socket) { //zweiter Spieler verbindet
      console.log('Player 2 connected');
      this.player2Socket = socket;

      this.player2 = new Player('player 2');

      this._makeGamePlayable();
      this._makeFirePossible(this.player1, _checkDown, _checkWin, _gameOver);
      this._makeFirePossible(this.player2, _checkDown, _checkWin, _gameOver);

      this.player2Socket.on('disconnect', () => {
        console.log('Player2 hat das Spiel verlassen');
        this.player2Socket = undefined;

        if (this.player1Socket) {
          this.player1Socket.emit('enemyDisconnect');
        }
      });

      this.player2Socket.on('setPlayerName', playerName => {
        this.player2.name = playerName;
        if (this._isAbleToPlay()) {
          this._refreshNames();
        }
      });

      this.player1Socket.emit('gameReady');
      this.player2Socket.emit('gameReady');

    } else { // dritter Spieler verbindet
      console.log("p3C connect.... ");
      socket.emit('msg', "Es läuft bereits ein Spiel, versuche es später noch einmal.");
    }
  }

  /**
   * Benachrichtige aktuellen Spieler, wer dran ist
   */
  _emitTurn() {
    if (this.turn == this.player1.id) {
      this.player1Socket.emit('playerTurn', true);
      this.player2Socket.emit('playerTurn', false);
    } else {
      this.player1Socket.emit('playerTurn', false);
      this.player2Socket.emit('playerTurn', true);
    }
  }
  /**
   *
   * @param {any} currentPlayer
   * @param {any} _checkDown
   * @param {any} _checkWin
   */
  _makeFirePossible(currentPlayer, _checkDown, _checkWin, _gameOver) {

    var playerSocket;
    var opponentSocket;
    var opponent;
    var nextTurn;

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
      if (currentPlayer.id === this.turn && !this.gameOver) {
        if (currentPlayer.id === this.player1.id) {
          this.player1.increaseScore();
        } else {
          this.player2.increaseScore();
        }
        if (opponent.field[y][x] == 1) { //Treffer

          playerSocket.emit('fireResult', true);
          opponentSocket.emit('fireResultEnemy', x, y, true);
          opponent.field[y][x] = 2;

          if (_checkDown(x, y, opponent.field)) {
            console.log("Schiff down");
            playerSocket.emit('shipDown', true, x, y);
            opponentSocket.emit('ownShipDown');
            if (_checkWin(opponent.field)) {
              _gameOver(playerSocket, opponentSocket, currentPlayer, opponent, this);
            }
          }

        } else { //verfehlt
          playerSocket.emit('fireResult', false);
          opponentSocket.emit('fireResultEnemy', x, y, false);
          opponent.field[y][x] = 3;

          this.turn = nextTurn;
          this._emitTurn();
        }
      }
    });
  }



  /**
   * Test / Controlling (gebe Spielfeld auf die Konsole)
   */
  controllLog() {
    var string1 = "Player1: \n";
    var string2 = "Player2: \n";
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        string1 += this.player1.field[j][i] + " ";
        string2 += this.player2.field[j][i] + " ";
      }
      string1 += "\n";
      string2 += "\n";
    }
    console.log(string1);
    console.log(string2);
  }

  /**
   * Benachrichtige Spieler (Zug, Schiffe) und wähle Startspieler aus
   */
  _makeGamePlayable() {
    this.gameOver = false;
    this.player1Socket.emit('myShips', this.player1.field);
    this.player2Socket.emit('myShips', this.player2.field);
    switch (Math.floor(Math.random() * (1 - 0 + 1)) + 0) {
      case 0:
        this.turn = this.player1.id;
        break;
      case 1:
        this.turn = this.player2.id;
    }
    this._emitTurn();
  }

  /**
   * Prüfe, ob Spiel bereit ist (Spieler sind da und haben einen Namen, Spiel ist nicht vorbei)
   */
  _isAbleToPlay() {
    return this.player1Socket &&
      this.player2Socket &&
      this.player1.name &&
      this.player2.name;
  }

  /**
   * Übermittle Namen des Gegenspielers
   */
  _refreshNames() {
    console.log("Namen wurden übermittelt: Player1: " + this.player1.name + ", Player2: " + this.player2.name);
    this.player1Socket.emit('refreshName', this.player2.name);
    this.player2Socket.emit('refreshName', this.player1.name);
  }
};