const HORIZONTAL = 0;
const VERTICAL = 1;

//URL´s
var scoreUrl = 'http://52.166.12.116:3000/api/highscore';
var shipsUrl = 'http://52.166.12.116:3000/api/ships';

var tableHorizontalIndex = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
var tableVerticalIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];

var backgroundColorWater = "#0071a5";
var backgroundColorShip = "#000000";
var backgroundColorHit = "#ff0000";

var shipsDefault = [
  [1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 1, 1, 1]
];

var ships = [
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
]; //0 Wasser, 1 Schiff, 2 getroffenes Schiff, 3 beschossen
var enemyShips = shipsDefault; //Gegnerisches Spielfeld
var ownShips = ships; //eigenes Spielfeld


function start() {
  createTable(1);
  createTable(2);
  getShips(1);
  getShips(2);
  getScore();

  $(document).ready(function() {
    $('#modal-1').modal('show');
  });
}

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

function getShips(player) {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', shipsUrl, true);
  xhttp.responseType = 'json';
  xhttp.onload = () => {
    var data = xhttp.response;
    if (data !== null) {
      printShips(data, player);
    }
  };
  xhttp.onerror = () => {
    console.log("Verbindung zum Server gescheitert, Schiffe konnten nicht geladen werden.");
    printShips(ownShips, 1);
  }
  xhttp.send(null);
}

//Schieße auf ein Feld
function shootSquare(id) {
  var x = id.split("", 3)[1];
  var y = id.split("", 3)[2];
  // TODO: logik hinzufügen
  node = document.getElementById('d' + id);

  if (enemyShips[x][y] == 1) { //Schiff
    node.setAttribute('class', 'hitShip');
    enemyShips[x][y] = 2;
    if (isShipDown(x, y)) {
      alert("Versenkt");
      markShipAsDown(x, y);
    }
  } else if (enemyShips[x][y] == 0) { //Wasser
    node.setAttribute('class', 'hitWater');
    enemyShips[x][y] = 3;
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
function printShips(data, player) {
  var row = 0;
  var square = 0;

  for (var i = 100; i <= 199; i++) {
    if (data[row][square++] == "1") {
      document.getElementById(i).style.background = backgroundColorShip;
    }
    if (square == 10) {
      row++;
      square = 0;
    }
  }
}

//"id" markiert tabelle,zeile und spalte (z.B. 145) | "hit" ist ein String 'hitShip' oder 'hitWater'
function markHit(hit, id) {
  node = document.getElementById('d' + id);
  switch (hit) {
    case 'hitShip':
      node.setAttribute('class', 'hitShip');
      break;
    case 'hitWater':
      node.setAttribute('class', 'hitWater');
      break;
    default:
      console.error("Fascher hit wurde übergeben.");
  }
}