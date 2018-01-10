const HIT = true;
const MISS = false;

//bereit zu Spielen
var nameGesetzt = false;

var tableHorizontalIndex = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
var tableVerticalIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];

var backgroundColorWater = "#0071a5";
var backgroundColorShip = "#000000";

var socket;
var lastFireX;
var lastFireY;

var ownField;
var enemyField = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];;

//0 Wasser, 1 Schiff, 2 getroffenes Schiff, 3 beschossen


$(document).ready(function() {

  socket = io();
  createTable(1);
  createTable(2);

  newLog("Warte auf Gegenspieler.");
  //document.getElementById("log").innerHTML = "Warte auf Gegenspieler";

  socket.on('fireResult', result => {
    markHit(result, 2, lastFireX, lastFireY);
    if (result) {
      //document.getElementById('log').innerHTML = "Dein Schuss hat getroffen, du bist nocheinmal dran.";
      newLog("Dein Schuss hat getroffen, du bist nocheinmal dran.");
    } else {
      newLog("Dein Schuss hat verfehlt.");
      //document.getElementById('log').innerHTML = "Dein Schuss hat verfehlt.";
    }
  });
  socket.on('fireResultEnemy', (x, y, result) => {
    markHit(result, 1, x, y);
    if (result) {
      //document.getElementById('log').innerHTML = "Der Schuss deines Gegners hat dich getroffen.";
      newLog("Der Schuss deines Gegners hat dich getroffen.");
    } else {
      //document.getElementById('log').innerHTML = "Der Schuss deines Gegners hat verfehlt.";
      newLog("Der Schuss deines Gegners hat verfehlt.");
    }
  });
  socket.on('myShips', playground => {
    ownField = playground;
    printShips(playground);
  });
  socket.on('playerTurn', isYourTurn => {
    if (isYourTurn) {
      $('#2Label').css('color', 'red');
      $('#1Label').css('color', 'black');

      newLog("Du bist am Zug.");

      //document.getElementById('log').innerHTML = "Du bist am Zug";

    } else {
      $('#2Label').css('color', 'black');
      $('#1Label').css('color', 'red');
      newLog("Der Gegner ist am Zug.\n");
      //document.getElementById('log').innerHTML = "Der Gegner ist am Zug";
    }
  });
  socket.on('won', highscore => {
    $('#tg').css('border-color', 'green');
    document.getElementById('body').style.backgroundColor = 'green';
    //  document.getElementById('log').innerHTML = "Du hast gewonnen! Dein Score: " + highscore;
    newLog("Du hast gewonnen! Dein Score: " + highscore + "\n");
    alert("Game Over!\n" + "Du hast gewonnen! Dein Score: " + highscore);
  });
  socket.on('lost', highscore => {
    $('#tg').css('border-color', 'red');
    document.getElementById('body').style.backgroundColor = 'red';
    newLog("Du hast verloren! Der Score deines Gegners: " + highscore + "\n");
    //  document.getElementById('log').innerHTML = "Du hast verloren! Der Score deines Gegners: " + highscore;
    alert("Game Over!\n" + "Du hast verloren! Der Score deines Gegners: " + highscore);
  });
  socket.on('refreshName', name => {
    newLog("Dein Gegnder hat seinen Namen gewählt, er heißt: " + name + "\n");
    //document.getElementById('log').innerHTML = "Dein Gegnder hat seinen Namen gewählt, er heißt: " + name;
    document.getElementById("outputp2").innerHTML = name;
  });
  socket.on('enemyDisconnect', () => {
    $('tg').css('border-color', 'grey');
    document.getElementById('body').style.backgroundColor = 'grey';
    newLog("Dein Gegner hat das Spiel verlassen.\n");
    //document.getElementById('log').innerHTML = "Dein Gegner hat das Spiel verlassen.";
    alert("Game Over!\n" + "Dein Gegner hat das Spiel verlassen.");
  });
  socket.on('shipDown', (x, y) => {
    newLog("Du hast ein Schiff versenkt.\n");
    //document.getElementById('log').innerHTML = "Du hast ein Schiff versenkt.";
    // TODO:
  });
  $('#modal-1').modal('show');
});

//Scrollfesnter nach unten scrollen
function nachunten() {
  var textarea = document.getElementById('log');
  textarea.scrollTop = textarea.scrollHeight;
}

//trage neue nachricht in Fesnter ein
function newLog(message) {
  var log = document.getElementById("log");
  var br = document.createElement("br");
  newNode = document.createTextNode(message);
  log.appendChild(newNode);
  log.appendChild(br);
  nachunten();
}
//Erstelle Spielfeld
function createTable(table) {
  var myTable = document.createElement("table");
  myTable.setAttribute("class", "tg");
  for (var i = 0; i < 11; i++) {
    currentRow = document.createElement("tr");

    for (var j = 0; j < 10; j++) {

      if (i == 0 && j == 0) { //oben
        currentCell = document.createElement("td");
        currentCell.setAttribute("colspan", 10);
        if (table == 1) {
          currentText = document.createTextNode("Dein Spielfeld");
        } else {
          currentText = document.createTextNode("Gegnerisches Spielfeld");
        }

        currentCell.id = table + "Label";
      } else if (i == 0) {

        //durch colspan bereits fertig -> nichts machen
      } else {
        currentCell = document.createElement("td");
        currentCell.id = table + "" + (i - 1) + "" + j;
        currentCell.setAttribute("height", 40);
        currentCell.setAttribute("width", 40);
        if (table == 2) { //schießen ist nur auf rechte Tabelle möglich
          currentCell.setAttribute('onclick', "shootSquare((this.id))");
        }
        currentCell.setAttribute('bgcolor', backgroundColorWater);
        currentText = document.createTextNode("");

        div = document.createElement('div');
        div.id = "d" + table + "" + (i - 1) + "" + j;
        currentCell.appendChild(div);
      }
      currentCell.appendChild(currentText);
      currentRow.appendChild(currentCell);
    }
    myTable.appendChild(currentRow);
  }
  myTable.setAttribute("border", 1);

  node = document.getElementById("hierTabelle" + table);
  node.appendChild(myTable);
}

//Namen werden gesetzt, wird aus dem Modal aufgerufen
function setText() {
  var name = document.getElementById("input1").value;
  document.getElementById("outputp1").innerHTML = name;
  socket.emit('setPlayerName', name);
  nameGesetzt = true;

  //schließe Modal
  $("#players_form").submit(function(e) {
    e.preventDefault();
    $('#modal-1').modal('hide')
  });

}

//Schieße auf ein Feld
function shootSquare(id) {
  if (nameGesetzt) { //Prüfe erst ob der Name gesetzt wurde
    var x = id.split("", 3)[1];
    var y = id.split("", 3)[2];

    if (enemyField[y][x] == 0) { //Schiff
      //console.log("Fire: x:" + x + " y:" + y);
      lastFireX = x;
      lastFireY = y;
      socket.emit('fire', x, y);
    } else { //Bereits getroffen
      //document.getElementById("outputp1").innerHTML = "Hier hast du schon geschossen";
      newLog("Hier hast du schon geschossen.\n");
    }
  } else {
    $('#modal-1').modal('show');
  }

}

//markiere gegnerisches Schiff wenn es versenkt wurde
function markShipAsDown(x, y) { // TODO: (Max) hier implemtieren
  //document.getElementById("2" + x + "" + y).style.background = backgroundColorShip;
  //                        /\
  //                        |
  //                 rechtes Spielfeld
}

//#####################Eigenes Spielfeld#########################
//Setze eigene Schiffe (nur grafisch) auf dem Spielfeld
function printShips(playground) {
  for (y = 0; y < 10; y++) {
    for (x = 0; x < 10; x++) {
      if (playground[y][x]) {
        document.getElementById('1' + x + y).style.backgroundColor = '#000000';
      }
    }
  }
}

//"id" markiert tabelle,zeile und spalte (z.B. 145) | "hit" ist ein String 'hitShip' oder 'hitWater'
function markHit(fireResult, player, x, y) {
  //console.log("Schuss markiert: " + player + "" + x + "" + y)
  node = document.getElementById('d' + player + "" + x + "" + y);
  switch (fireResult) {
    case HIT:
      node.setAttribute('class', 'hitShip');
      if (player == 1) {
        ownField[y][x] = 2;
      } else {
        enemyField[y][x] = 2;
      }
      break;
    case MISS:
      node.setAttribute('class', 'hitWater');
      if (player == 1) {
        ownField[y][x] = 3;
      } else {
        enemyField[y][x] = 3;
      }
  }


}