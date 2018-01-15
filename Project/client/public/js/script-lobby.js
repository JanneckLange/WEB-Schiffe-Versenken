var socket;


$(document).ready(function() {
  socket = io();

  //Empfamge game objekt um dem Spiel beizutreten
  socket.on('yourGame', () => {

  });

  //Empfange array der aktuell laufenden Spiele
  socket.on('refreshRunningGames', games => {
    refreshRunningGames(games);
  });


  getScore(10);
});

/**
 *Sende Serverbefehl die liste der aktuell laufenden Spiele neu zu senden
 */
function refreshRunningGames_emit() {
  socket.emit('refreshRunningGames');
}

/**
 * Aktuallisiere Liste der aktuell laufenden Spiele
 * Trägt werte in Tabelle ein
 * @param {array} games
 */
function refreshRunningGames(games) {
  createGamesTable(games.length);
  //Trage werte in Tabelle ein
}

/**
 * Erstelle Tabelle in die die Games eingetragen werden
 * @param {Number} length
 */
function createGamesTable(length) {
  // TODO: erstelle Tabelle
}