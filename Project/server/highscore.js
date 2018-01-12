const path = require('path');
const fs = require('fs');
const highscorePath = __dirname + '/highscore.json';


function readHighscore(path) {
    var entries=fs.readFileSync(path, 'utf8');
    entries = JSON.parse(entries);
    return entries;
}

function updateScore(score, name) {
    let entries = readHighscore(highscorePath);

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