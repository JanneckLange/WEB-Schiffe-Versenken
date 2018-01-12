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
            console.log(data);
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
    //alert(" " + text[0]._name)
    //alert(" " + text[1]._name)

    var j = 0;
    var array = [];
    var nameToInsert = 0;
    var pointsA = [];
    var pointsA2 = [];
    var pointsASize = 0;
    var nameInPA = false;
    var arrayPos = 0;
    var arrayPos2 = 0;

    //Prüfe wie viele Elemente vorhanden sind
    try {
        while (text[j]._name != 'undefined') {
            j++;
        }
    } catch (e) {

    }

    for (var i = 0; i < j; i++) {
        if (text[i]._name != null) {
            array[arrayPos] = text[i]._score + " " + text[i]._name;
            arrayPos++;
        }
    }

    for (var k = 0; k < j; k++) {
        if (text[k]._name != null) {
            pointsA[arrayPos2] = parseInt(text[k]._score);
            arrayPos2++;
            pointsASize++;
        }
    }

    pointsA.sort(function (a, b) {
        return a - b
    });


    for (var g = 0; g < j; g++) {
        if (text[g]._name != null) {

            for (var m = 0; m < j; m++) {
                if (pointsA[g] == text[m]._score) {

                    for (var n = 0; n < pointsASize; n++) {
                        if (String(pointsA[n]).includes(text[m]._name)) {
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
                pointsA2[arrayPos2] = pointsA[g] + " " + text[nameToInsert]._name;
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