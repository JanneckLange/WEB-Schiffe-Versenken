//Highscore
var textField = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5']
var pointField = ['po1', 'po2', 'po3', 'po4', 'po5']

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
]; //0 Wasser, 1 Schiff, 2 getroffenes Schiff, 3 beschossen
var enemyShips = shipsDefault; //Gegnerisches Spielfeld
var ownShips = shipsDefault; //eigenes Spielfeld


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
}

//Laden den Highscore vom Server
function getScore() {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', scoreUrl, true);
  xhttp.responseType = 'json';
  xhttp.onload = () => {
    var data = xhttp.response;
    if (data !== null) {
      var array = getData(data);
      printData(array);
    }
  };
  xhttp.onerror = () => {
    console.log("Verbindung zum Server gescheitert, Highscore konnte nicht geladen werden.");
  }
  xhttp.send(null);
}

//Editiere HighscoreArray
function getData(text) {
  var j = 0;
  var array = [];
  var nameToInsert = 0;
  var pointsA = [];
  var pointsA2 = [];
  var pointsASize = 0;
  var nameInPA = false;
  var arrayPos = 0;
  var arrayPos2 = 0;

  try {
    while (text.highscore[j].name != 'undefined') {
      j++;
    }
  } catch (e) {

  }

  for (var i = 0; i < j; i++) {
    if (text.highscore[i].name != null) {
      array[arrayPos] = text.highscore[i].points + " " + text.highscore[i].name;
      arrayPos++;
    }
  }

  for (var k = 0; k < j; k++) {
    if (text.highscore[k].name != null) {
      pointsA[arrayPos2] = parseInt(text.highscore[k].points);
      arrayPos2++;
      pointsASize++;
    }
  }

  pointsA.sort(function(a, b) {
    return a - b
  });


  for (var g = 0; g < j; g++) {
    if (text.highscore[g].name != null) {

      for (var m = 0; m < j; m++) {
        if (pointsA[g] == text.highscore[m].points) {

          for (var n = 0; n < pointsASize; n++) {
            if (String(pointsA[n]).includes(text.highscore[m].name)) {
              nameInPA = true;
            }
          }
          if (!nameInPA) {
            nameToInsert = m;
            m = j;
          }
        }

      }
      if (!nameInPA) {
        pointsA2[arrayPos2] = pointsA[g] + " " + text.highscore[nameToInsert].name;
        arrayPos2++;
      }
      nameInPa = false;
    }
  }
  pointsA2.splice(0, pointsASize);

  return pointsA2;
}

//Füge den Highscore auf der Seite ein
function printData(array) {
  for (var i = 0; i < array.length && i < textField.length; i++) {
    document.getElementById(textField[i]).textContent = "" + (i + 1) + ". " + array[i].split(" ")[1];
    document.getElementById(pointField[i]).textContent = array[i].split(" ")[0];
  }
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

//Färbe den Hintergrund, wenn ein Schiff versenkt wurde
function isShipDown(x, y) { // TODO: Hat noch fehler
  /*
    prüfe drumherum (wenn möglich), ob ein ungetroffenes Schiff existiert
    für bereits getroffene schiffe wird diese Methode erneut aufgerufen, nachdem das aktuelle Feld auf 0 gesetzt wurde.
    findet sich kein ungetroffenes Schiff, wird die fläche eingefärbt.
  */
  x = parseInt(x);
  y = parseInt(y);
  for (var i = 0; i < 4; i++) {
    var z1 = 0;
    var z2 = 0;
    switch (i) {
      case 0:
        z1 = (x + 1);
        z2 = y;
        break;
      case 1:
        z1 = (x - 1);
        z2 = y;
        break;
      case 2:
        z2 = (y + 1);
        z1 = x;
        break;
      case 3:
        z2 = (y - 1);
        z1 = x;
        break;
      default:
    }

    if (z1 >= 0 && z1 <= 9 && z2 >= 0 && z2 <= 9) {
      if (enemyShips[z1][z2] == 1) {
        return false;
      } else if (enemyShips[z1][z2] == 2) {
        enemyShips[z1][z2] = 0;
        isShipDown(z1, z2);
        enemyShips[z1][z2] = 2;
      }
    }
  }
  return true;
}

function markShipAsDown(x, y) { // TODO: Hat noch fehler
  x = parseInt(x);
  y = parseInt(y);
  for (var i = 0; i < 4; i++) {
    var z1 = 0;
    var z2 = 0;
    switch (i) {
      case 0:
        z1 = (x + 1);
        z2 = y;
        break;
      case 1:
        z1 = (x - 1);
        z2 = y;
        break;
      case 2:
        z2 = (y + 1);
        z1 = x;
        break;
      case 3:
        z2 = (y - 1);
        z1 = x;
        break;
      default:
    }
    if (z1 >= 0 && z1 <= 9 && z2 >= 0 && z2 <= 9) {
      if (enemyShips[z1][z2] == 2) {
        document.getElementById("2" + x + "" + y).style.background = backgroundColorShip;
        enemyShips[z1][z2] = 0;
        markShipAsDown(z1, z2);
        enemyShips[z1][z2] = 2;
      }
    }
  }
}

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