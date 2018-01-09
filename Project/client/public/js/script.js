//URL´s
var scoreUrl = 'http://52.166.12.116:3000/api/highscore';
var shipsUrl = 'http://52.166.12.116:3000/api/ships';

const HIT = true;
const MISS = false;

var tableHorizontalIndex = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
var tableVerticalIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];

var backgroundColorWater = "#0071a5";
var backgroundColorShip = "#000000";
var backgroundColorHit = "#ff0000";

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

let socket;
let lastFireX;
let lastFireY;
$(document).ready(function() {
  socket = io();
  createTable(1);
  createTable(2);

  socket.on('fireResult', result => {
    markHit(result, 2, lastFireX, lastFireY);
  });
  socket.on('fireResultEnemy', (x, y, result) => {
    markHit(result, 1, x, y);
  });
  socket.on('myShips', playground => {
    ownField = playground;
    printShips(playground);
  });
  socket.on('playerTurn', isYourTurn => {
    if (isYourTurn) {
      $('#2Label').css('color', 'red');
      $('#1Label').css('color', 'black');
    } else {
      $('#2Label').css('color', 'black');
      $('#1Label').css('color', 'red');
    }
  });
  socket.on('won', highscore => {
    document.getElementById('myBody').style.backgroundColor = 'green';
    $('#highscore').html('YOUR HIGHSCORE: ' + highscore);
    $('#resetGame').css('visibility', 'visible');
  });
  socket.on('lost', highscore => {
    document.getElementById('myBody').style.backgroundColor = 'red';
    $('#highscore').html('OPPONENTS HIGHSCORE: ' + highscore);
    $('#resetGame').css('visibility', 'visible');
  });
  socket.on('myDestroyedShips', (x, y) => {
    document.getElementById('myField' + x + y).style.backgroundColor = '#008eb7';
  });
  socket.on('opponentDestroyedShips', (x, y) => {
    document.getElementById('enemField' + x + y).style.backgroundColor = '#008eb7';
  });
  socket.on('refreshName', name => {
    $("#opponentLabel").html(name);
  });
  $('#modal-1').modal('show');
});



//Erstelle Spielfeld
function createTable(table) {
  var myTable = document.createElement("table");
  myTable.setAttribute("class", "tg");
  for (var i = 0; i < 11; i++) {
    currentRow = document.createElement("tr");
    for (var j = 0; j < 11; j++) {
      currentCell = document.createElement("td");
      if (i == 0 && j == 0) {
        currentText = document.createTextNode("P" + table);
        currentCell.id = table + "Label";
      } else if (i == 0) {
        currentText = document.createTextNode(tableHorizontalIndex[j - 1]);
      } else if (j == 0) {
        currentText = document.createTextNode(tableVerticalIndex[i - 1]);
      } else {
        currentCell.id = table + "" + (i - 1) + "" + (j - 1);
        if (table == 2) {
          currentCell.setAttribute('onclick', "shootSquare((this.id))");
        }
        currentCell.setAttribute('bgcolor', backgroundColorWater);
        currentText = document.createTextNode("");

        div = document.createElement('div');
        div.id = "d" + table + "" + (i - 1) + "" + (j - 1)
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
  var spieler1 = document.getElementById("input1").value;
  var spieler2 = document.getElementById("input2").value;
  document.getElementById("output").innerHTML = spieler1 + " gegen " + spieler2;

  $("#players_form").submit(function(e) {
    e.preventDefault();
    $('#modal-1').modal('hide')
  });

}

//Schieße auf ein Feld
function shootSquare(id) {
  var x = id.split("", 3)[1];
  var y = id.split("", 3)[2];

  if (enemyField[y][x] == 0) { //Schiff
    console.log("Fire: x:" + x + " y:" + y);
    lastFireX = x;
    lastFireY = y;
    socket.emit('fire', x, y);
  } else { //Bereits getroffen
    alert("Hier hast du schon geschossen");
  }
}

//markiere gegnerisches Schiff wenn es versenkt wurde
function markShipAsDown(x, y) { // TODO:
  document.getElementById("2" + x + "" + y).style.background = backgroundColorShip;
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
  console.log("Schuss markiert: " + player + "" + x + "" + y)
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
      break;
    default:
      console.error("Fascher hit wurde übergeben.");
  }


}