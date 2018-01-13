const fs = require('fs');
const highscorePath = __dirname + '/highscore.json';


function readHighscore(path) {
	try {
		var entries = fs.readFileSync(path, 'utf8');
		entries = JSON.parse(entries);
		return entries;
	} catch (e) {
		return null;
	}

}

function updateScore(score, name) {
	let entries = readHighscore(highscorePath);
	if (!entries) {
		entries = [];
	}

	let newEntry = {};
	newEntry._name = name;
	newEntry._score = score;

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