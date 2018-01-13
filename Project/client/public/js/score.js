var scoreUrl = 'http://127.0.0.1:3000/api/highscore';

//Highscore
var textField = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5'];
var pointField = ['po1', 'po2', 'po3', 'po4', 'po5'];

/**
 * Lädt den Highscore vom Server und gibt ihn aus.
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
		console.log("Highscore konnte nicht geladen werden.");
	};
	xhttp.send(null);
}

/**
 * Gibt das eingelesene HighscoreTextArray als formatiertes und sortiertes HighscoreArray zurück
 * @param {any} text vom eingelesenen Array
 */
function getData(text) {

	var arrayCounter = 0;
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
		while (text[arrayCounter]._name != 'undefined') {
			arrayCounter++;
		}
	} catch (e) {

	}

	// Übergibt die Positionen vom TextArray ins HighscoreArray
	for (let i = 0; i < arrayCounter; i++) {
		if (text[i]._name != null) {
			array[arrayPos] = text[i]._score + " " + text[i]._name;
			arrayPos++;
		}
	}

	// Erstellt ein PunkteArray
	for (let k = 0; k < arrayCounter; k++) {
		if (text[k]._name != null) {
			pointsA[arrayPos2] = parseInt(text[k]._score);
			arrayPos2++;
			pointsASize++;
		}
	}

	// Sortiert das PunkteArray
	pointsA.sort(function (a, b) {
		return a - b;
	});

	// Erstellt das zurückliefernde und sortierte HighscoreArray
	for (let g = 0; g < arrayCounter; g++) {
		if (text[g]._name != null) {

			for (let m = 0; m < arrayCounter; m++) {
				if (pointsA[g] == text[m]._score) {

					for (let n = 0; n < pointsASize; n++) {
						if (String(pointsA[n]).includes(text[m]._name)) {
							nameInPA = true;
						}
					}
					if (!nameInPA) {
						nameToInsert = m;
						m = arrayCounter;
					}
				}

			}
			if (!nameInPA) {
				pointsA2[arrayPos2] = pointsA[g] + " " + text[nameToInsert]._name;
				arrayPos2++;
			}
			nameInPA = false;
		}
	}
	pointsA2.splice(0, pointsASize);

	return pointsA2;
}

/**
 * Füge den Highscore auf der Seite ein
 * @param {any} array des Highscore in Form von {"_name":"String","_score":Number}
 */
function printData(array) {
	for (let i = 0; i < array.length && i < textField.length; i++) {
		document.getElementById(textField[i]).textContent = "" + (i + 1) + ". " + array[i].split(" ")[1];
		document.getElementById(pointField[i]).textContent = array[i].split(" ")[0];
	}
}