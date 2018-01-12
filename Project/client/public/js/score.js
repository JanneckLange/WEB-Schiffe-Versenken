var scoreUrl = 'http://127.0.0.1:3000/api/highscore';

//Highscore
var textField = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5']
var pointField = ['po1', 'po2', 'po3', 'po4', 'po5']

/**
 * Lade den Highscore vom Server
 */
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

/**
 * Editiere HighscoreArray
 * @param {any} text
 */
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

    pointsA.sort(function (a, b) {
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

/**
 * Füge den Highscore auf der Seite ein
 * @param {any} array
 */
function printData(array) {
    for (var i = 0; i < array.length && i < textField.length; i++) {
        document.getElementById(textField[i]).textContent = "" + (i + 1) + ". " + array[i].split(" ")[1];
        document.getElementById(pointField[i]).textContent = array[i].split(" ")[0];
    }
}