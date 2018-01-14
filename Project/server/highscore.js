const fs = require('fs');
const highscorePath = __dirname + '/highscore.json';

/**
 * Liest den aktuellen Highscore aus der Datei und gibt diesen als Array zurück.
 * @param {any} path ist der Dateipfad, wo der Highscore gelesen werden soll.
 */
function readHighscore(path) {
	try {
		var entries = fs.readFileSync(path, 'utf8');
		entries = JSON.parse(entries);
		return entries;
	} catch (e) {
		return null;
	}
}

/**
 * Fügt den übergebenen Score zum Highscore hinzu.
 * @param {any} score
 * @param {any} name
 */
function updateScore(score, name) {
	console.log('Update Highscore from ' + name + ' with ' + score + 'points');
	let entries = readHighscore(highscorePath);
	if (!entries) {
		entries = [];
	}
	// Neues ScoreArray anlegen
	let newEntry = {};
	newEntry._name = name;
	newEntry._score = score;

	// Das neue ScoreArray zum HighscoreArray hinzufügen, formatieren und in Datei schreiben.
	entries.push(newEntry);
	entries = JSON.stringify(entries);
	try {
		fs.writeFileSync(highscorePath, entries, 'utf8');
		return true;
	} catch (err) {
		return false;
	}
}

module.exports = {
	readHighscore: readHighscore,
	updateScore: updateScore,
};