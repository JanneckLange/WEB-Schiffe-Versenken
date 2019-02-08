const HIT = true;
const MISS = false;

//bereit zu Spielen
let nameGesetzt = false;
let gameOver = false;

let ownScore = 0;
let enemyScore = 0;
let backgroundColorWater = "#0071a5";
let backgroundColorShip = "#000000";

let socket;

let lastFireX;
let lastFireY;

let ownField;
let enemyField = [
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
];

//0 Wasser, 1 Schiff, 2 getroffenes Schiff, 3 beschossen

/*
 *  mache irgendetwas mit {result}
*/

$(document).ready(function () {

    socket = io();
    createTable(1);
    createTable(2);

    newLog("Warte auf Gegenspieler.");
    //document.getElementById("log").innerHTML = "Warte auf Gegenspieler";

    socket.on('gameReady', () => {
        trigger_music_song1();
    });

    socket.on('fireResult', result => {
        updateScore(++ownScore, 2);
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
        updateScore(++enemyScore, 1);
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
            trigger_sound_ship_down();
            markShipAsDown(x, y);
        } else {
            //newLog("Schiff noch nicht versenkt.");
        }
    });

    socket.on('myShips', playground => {
        ownField = playground;
        printShips(playground, 1);
    });

    socket.on('playerTurn', isYourTurn => {
        if (isYourTurn) {
            trigger_sound_your_turn();
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
        trigger_music_win();
        newLog("Du hast gewonnen! Dein Score: " + highscore + "\n");
        gameOver = true;
    });

    socket.on('lost', (highscore, playground) => {
        $('#tg').css('border-color', 'red');
        document.getElementById('body').style.backgroundColor = 'red';
        trigger_music_lost();
        newLog("Du hast verloren! Der Score deines Gegners: " + highscore + "\n");
        gameOver = true;
        printShips(playground, 2);
    });

    socket.on('ownShipDown', () => {
        trigger_sound_ship_down();
        newLog("Eins Deiner Schiffe wurde versenkt!\n");
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
 * Lädt die Seite neu, wenn Modal bestätigt wurde
 */
function new_game_button() {
    location.reload();
}

/**
 * Zeigt den aktuellen Punktestand an
 * @param {any} score sind die Punkte
 * @param {any} player ist der Player
 */
function updateScore(score, player) {
    var text = "Score: " + score;
    var scoreField;
    if (player == 1) {
        scoreField = document.getElementById("score1");
    } else {
        scoreField = document.getElementById("score2");
    }
    scoreField.innerHTML = text;
}

/**
 * Scrollfenster nach unten scrollen
 */
function schrollLogWindowDown() {
    let textarea = document.getElementById('log');
    textarea.scrollTop = textarea.scrollHeight;
}

/**
 * trage neue nachricht in Fesnter ein
 * @param {any} message
 */
function newLog(message) {
    let log = document.getElementById("log");
    let br = document.createElement("br");
    newNode = document.createTextNode(message);
    log.appendChild(newNode);
    log.appendChild(br);
    schrollLogWindowDown();
}

/**
 * Erstellt das Spielfeld
 * @param {any} table ist die Zahl des Spielfeldes
 */
function createTable(table) {
    let myTable = document.createElement("table");
    myTable.setAttribute("class", "tg");
    let currentCell;
    let div;
    for (let i = 0; i < 11; i++) {
        currentRow = document.createElement("tr");

        for (let j = 0; j < 10; j++) {

            if (i === 0 && j === 0) { //oben
                currentCell = document.createElement("td");
                currentCell.setAttribute("colspan", 6);
                currentText = document.createTextNode("");
                let newP = document.createElement("p");
                if (table === 1) {
                    newP.appendChild(document.createTextNode("Dein Spielfeld"));
                } else {
                    newP.appendChild(document.createTextNode("Gegnerisches Spielfeld"));
                }
                currentCell.appendChild(newP);
                currentCell.id = table + "Label";
            } else if (i === 0 && j === 6) {
                currentCell = document.createElement("td");
                currentCell.setAttribute("colspan", 4);
                var newP = document.createElement("p");
                newP.appendChild(document.createTextNode("Score: 0"));
                newP.id = "score" + table;
                currentCell.appendChild(newP);

            } else if (i === 0) {

                //durch colspan bereits fertig -> nichts machen
            } else {
                currentCell = document.createElement("td");
                currentCell.id = table + "" + (i - 1) + "" + j;
                currentCell.setAttribute("height", 40);
                currentCell.setAttribute("width", 40);
                if (table === 2) { //schießen ist nur auf rechte Tabelle möglich
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

    let node = document.getElementById("hierTabelle" + table);
    node.appendChild(myTable);
}

/**
 * Namen werden gesetzt, wird aus dem Modal aufgerufen
 */
function setText() {
    let name = document.getElementById("input1").value;
    document.getElementById("outputp1").innerHTML = name;
    socket.emit('setPlayerName', name);
    nameGesetzt = true;

    //schließe Modal
    $("#players_form").submit(function (e) {
        e.preventDefault();
        $('#modal-1').modal('hide')
    });

}

/**
 * Schieße auf ein Feld
 * @param {any} id der Stelle des Spielfeldes
 */
function shootSquare(id) {
    if (nameGesetzt && !gameOver) { //Prüfe erst ob der Name gesetzt wurde
        let x = id.split("", 3)[1];
        let y = id.split("", 3)[2];

        if (enemyField[y][x] == 0) { //noch nicht beschossen
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

/**
 * markiert das gegnerische Schiff, wenn es versenkt wurde
 * @param {any} x
 * @param {any} y
 */
function markShipAsDown(x, y) {
    var ind = Number(x) + 1;

    if (enemyField[y][x] == 2) {
        document.getElementById("2" + x + "" + y).style.background = backgroundColorShip;
        let ind = Number(x) + 1;

        //Suche Schiff nach unten
        for (let i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[y][ind] === 0 || enemyField[y][ind] === 3) {
                    i = 5; //break
                } else if (enemyField[y][ind] === 2) {
                    document.getElementById("2" + ind + "" + y).style.background = backgroundColorShip;
                    ind++;
                }
            }
        }

        //Suche Schiff nach oben
        ind = Number(x) - 1;
        for (let i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[y][ind] === 0 || enemyField[y][ind] === 3) {
                    i = 5; //break
                } else if (enemyField[y][ind] === 2) {
                    document.getElementById("2" + ind + "" + y).style.background = backgroundColorShip;
                    ind--;
                }
            }
        }

        //Suche Schiff nach rechts
        ind = Number(y) + 1;
        for (let i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[ind][x] === 0 || enemyField[ind][x] === 3) {
                    i = 5; //break
                } else if (enemyField[ind][x] === 2) {
                    document.getElementById("2" + x + "" + ind).style.background = backgroundColorShip;
                    ind++;
                }
            }
        }

        //Suche Schiff nach links
        ind = Number(y) - 1;
        for (let i = 0; i < 5; i++) {
            if (ind >= 0 && ind <= 9) {
                if (enemyField[ind][x] === 0 || enemyField[ind][x] === 3) {
                    i = 5; //break
                } else if (enemyField[ind][x] === 2) {
                    document.getElementById("2" + x + "" + ind).style.background = backgroundColorShip;
                    ind--;
                }
            }
        }
    }
}

/**
 * Setzt das eigene Schiffe (nur grafisch) auf dem Spielfeld
 * @param {any} playground
 * @param {any} player als Zahl des Spielers
 */
function printShips(playground, player) {
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            if (playground[y][x] === 1 || playground[y][x] === 2) {
                document.getElementById(player + "" + x + "" + y).style.backgroundColor = '#000000';
            }
        }
    }
}

/**
 * "id" markiert tabelle,zeile und spalte (z.B. 145)
 * @param {any} fireResult ist ein String 'hitShip' oder 'hitWater'
 * @param {any} player als Zahl
 * @param {any} x als Zahlenkoordinate
 * @param {any} y als Zahlenkoordinate
 */
function markHit(fireResult, player, x, y) {
    //console.log("Schuss markiert: " + player + "" + x + "" + y)
    let node = document.getElementById('d' + player + "" + x + "" + y);
    switch (fireResult) {
        case HIT:
            node.setAttribute('class', 'hitShip');
            if (player === 1) {
                ownField[y][x] = 2;
            } else {
                enemyField[y][x] = 2;
            }
            break;
        case MISS:
            node.setAttribute('class', 'hitWater');
            if (player === 1) {
                ownField[y][x] = 3;
            } else {
                enemyField[y][x] = 3;
            }
    }
}