const HIT = true;
const MISS = false;

//bereit zu Spielen
var nameGesetzt = false;
var gameOver = false;

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


$(document).ready(function () {

    socket = io();
    createTable(1);
    createTable(2);

    newLog("Warte auf Gegenspieler.");
    //document.getElementById("log").innerHTML = "Warte auf Gegenspieler";


    socket.on('fireResult', result => {
        markHit(result, 2, lastFireX, lastFireY);
        if (result) {
            newLog("Dein Schuss hat getroffen, du bist nocheinmal dran.");
            trigger_sound_hit_ship();
        } else {
            newLog("Dein Schuss hat verfehlt.");
            trigger_sound_hit_water();
        }
    });

    socket.on('fireResultEnemy', (x, y, result) => {
        markHit(result, 1, x, y);
        if (result) {
            newLog("Der Schuss deines Gegners hat dich getroffen.");
            trigger_sound_hit_ship();
        } else {
            newLog("Der Schuss deines Gegners hat verfehlt.");
            trigger_sound_hit_water();
        }
    });

    socket.on('shipDown', (shipDownResult, x, y) => {
        if (shipDownResult) {
            newLog("Du hast ein Schiff versenkt.\n");
            markShipAsDown(x, y);
        } else {
            //newLog("Schiff noch nicht versenkt.");
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
        } else {
            $('#2Label').css('color', 'black');
            $('#1Label').css('color', 'red');
            newLog("Der Gegner ist am Zug.");
        }
    });
    socket.on('won', highscore => {
        $('#tg').css('border-color', 'green');
        document.getElementById('body').style.backgroundColor = 'green';
        newLog("Du hast gewonnen! Dein Score: " + highscore + "\n");
        gameOver = true;
    });

    socket.on('lost', highscore => {
        $('#tg').css('border-color', 'red');
        document.getElementById('body').style.backgroundColor = 'red';
        newLog("Du hast verloren! Der Score deines Gegners: " + highscore + "\n");
        gameOver = true;
    });

    socket.on('refreshName', name => {
        newLog("Dein Gegner hat seinen Namen gewählt, er heißt: " + name + "\n");
        document.getElementById("outputp2").innerHTML = name;
    });

    socket.on('enemyDisconnect', () => {
        document.getElementById('body').style.backgroundColor = 'grey';
        newLog("Dein Gegner hat das Spiel verlassen.\n");
        gameOver = true;
    });

    socket.on('connect_error', () => {
        newLog("Verbindung zum Server verloren.");
        document.getElementById('body').style.backgroundColor = 'grey';
        gameOver = true;
        $('#modal-4').modal('show');
    });

    socket.on('msg', msg => {
        newLog(msg);
    });

    $('#modal-1').modal('show');

    getScore();
});

/**
 * 
 */
function connect_error_button() {
    location.reload();
}

/**
 * Scrollfenster nach unten scrollen
 */
function schrollLogWindowDown() {
    var textarea = document.getElementById('log');
    textarea.scrollTop = textarea.scrollHeight;
}

/**
 * trage neue nachricht in Fesnter ein
 * @param {any} message
 */
function newLog(message) {
    var log = document.getElementById("log");
    var br = document.createElement("br");
    newNode = document.createTextNode(message);
    log.appendChild(newNode);
    log.appendChild(br);
    schrollLogWindowDown();
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
                    currentCell.setAttribute('class', 'ownTableToShotAt');
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
    $("#players_form").submit(function (e) {
        e.preventDefault();
        $('#modal-1').modal('hide')
    });

}

//Schieße auf ein Feld
function shootSquare(id) {
    if (nameGesetzt && !gameOver) { //Prüfe erst ob der Name gesetzt wurde
        var x = id.split("", 3)[1];
        var y = id.split("", 3)[2];

        if (enemyField[y][x] == 0) { //Schiff
            //console.log("Fire: x:" + x + " y:" + y);
            lastFireX = x;
            lastFireY = y;
            socket.emit('fire', x, y);
        } else { //Bereits getroffen
            newLog("Hier hast du schon geschossen.\n");
        }
    } else {
        if (gameOver) {
            newLog("Das Spiel ist vorbei. Schießen ist nicht mehr möglich.");
        } else {
            $('#modal-1').modal('show');
            newLog("Wähle einen Namen bevor du einen Schuss abgibst");
        }

    }
}

//markiere gegnerisches Schiff wenn es versenkt wurde
function markShipAsDown(x, y) {


    var ind = Number(x) + 1;

    if (enemyField[y][x] == 2) {
        document.getElementById("2" + x + "" + y).style.background = backgroundColorShip;
        var ind = Number(x) + 1;

        for (var i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[y][ind] == 0) {
                    i = 5;
                }
                if (enemyField[y][ind] == 3) {
                    i = 5;
                }
                if (enemyField[y][ind] == 2) {
                    document.getElementById("2" + ind + "" + y).style.background = backgroundColorShip;
                    ind++;
                }
            }
        }

        var ind = Number(x) - 1;
        for (var i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[y][ind] == 0) {
                    i = 5;
                }
                if (enemyField[y][ind] == 3) {
                    i = 5;
                }
                if (enemyField[y][ind] == 2) {
                    document.getElementById("2" + ind + "" + y).style.background = backgroundColorShip;
                    ind--;
                }
            }
        }

        var ind = Number(y) + 1;
        for (var i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[ind][x] == 0) {
                    i = 5;
                }
                if (enemyField[ind][x] == 3) {
                    i = 5;
                }
                if (enemyField[ind][x] == 2) {
                    document.getElementById("2" + x + "" + ind).style.background = backgroundColorShip;
                    ind++;
                }
            }
        }

        var ind = Number(y) - 1;
        for (var i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[ind][x] == 0) {
                    i = 5;
                }
                if (enemyField[ind][x] == 3) {
                    i = 5;
                }
                if (enemyField[ind][x] == 2) {
                    document.getElementById("2" + x + "" + ind).style.background = backgroundColorShip;
                    ind--;
                }
            }
        }
    }
}

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