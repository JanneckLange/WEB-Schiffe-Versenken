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
 * Erstelle Tabelle in die die Games eingetragen werden
 * Trägt werte in Tabelle ein
 * @param {array} game
 */
function refreshRunningGames(games) {
  var myTable = document.createElement("table");
  myTable.id = "gameListTable";
  myTable.setAttribute("border", 1);

  //Titelzeile
  var myRow = document.createElement("tr");
  var myHeadColumn1 = document.createElement("th");
  var myHeadColumn2 = document.createElement("th");
  var myHeadColumn3 = document.createElement("th");
  myHeadColumn1.appendChild(document.createTextNode("Spielname"));
  myHeadColumn2.appendChild(document.createTextNode("Spieleranzahl"));
  myHeadColumn3.appendChild(document.createTextNode("Beitreten"));
  myRow.appendChild(myHeadColumn1);
  myRow.appendChild(myHeadColumn2);
  myRow.appendChild(myHeadColumn3);
  myTable.appendChild(myRow);


  for (let row = 0; row < games.length; row++) {
    myRow = document.createElement("tr");

    for (let column = 0; column < 3; column++) {
      myCell = document.createElement("td");
      myCell.setAttribute("height", 40);
      switch (column) {
        case 0:
          myCell.appendChild(document.createTextNode("Spielname"));
          myCell.setAttribute("width", 120);
          break;
        case 1:
          myCell.appendChild(document.createTextNode("1/2"));
          myCell.setAttribute("width", 100);
          break;
        case 2:
          myCell.setAttribute("width", 100);

          //Button
          var gameButton = document.createElement("input");
          gameButton.type = "button";
          gameButton.id = "gameButton-" + row;
          gameButton.value = "Join";
          gameButton.setAttribute("class", "btn btn-primary");
          gameButton.setAttribute("onclick", "joinGame(this.id.split('-', 2)[1])");
          myCell.appendChild(gameButton);

          break;
        default:

      }

      myRow.appendChild(myCell);
    }
    myTable.appendChild(myRow);

  }
  var tablePos = document.getElementById("gameListHere");
  tablePos.replaceChild(myTable, document.getElementById("gameListTable"));
}

/**
 *
 * @param  {String} index des zu joinenden Games
 */
function joinGame(index) {

}