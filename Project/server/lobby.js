const Game = require(__dirname + '/game');

module.exports = class Lobby {


  constructor() {
    this._arrayOfGames = new Array();
  }

  get arrayOFGames() {
    return this._arrayOfGames;
  }

  /**
   * Startet das Spiel, sobald eine Verbindung zum Server aufgebaut wurde.
   * @param {any} socket
   */
  startLobby(socket) {

    socket.on('refreshRunningGames', () => {
      socket.emit('refreshRunningGames', this._arrayOfGames);
    });

    //Client möchte Spiel Joinen
    socket.on('join', (gameName) => {
      // TODO: Prüfe ob game verfügbar
      for (var i = 0; i < this._arrayOfGames.length; i++) {
        if (this._arrayOfGames[i]._name == gameName) {
          console.log("Spiele passen überein");
          this._arrayOfGames[i].startGame(socket);
          socket.emit('yourGame');
        }
      }
      //game._startGame(socket);
    });

    //Erstelle neues Spiel für Clienten und sende es ihm
    socket.on('newGame', (gameName) => {
      var newGame = new Game(gameName);

      this._arrayOfGames.push(newGame);
      newGame.startGame(socket);



      console.log("Neues Spiel erstellt: " + gameName);
    });

  }

  //lösche beendetes Spiel aus dem Speicher
  gameOver(game) {
    for (var i = 0; i < this._arrayOfGames.length; i++) {
      if (this._arrayOfGames[i] === game) {
        arrayOfGames.splice(i,  1);
      }
    }
  }

}