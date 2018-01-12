const path = require('path');
const fs = require('fs');
const highscorePath = __dirname + '/highscore.json';


function readHighscore(path) {
    var entries=fs.readFileSync(path, 'utf8');
    entries = JSON.parse(entries);
    return entries;

}

function addScore(score, name) {
    let entry = this._entries.find(score => { return score.name === newEntry.name; });

    if (entry === undefined) {
        this._entries.push(newEntry);
    } else {
        if (entry.score < newEntry.score) {
            entry.score = newEntry.score;
        }
    }
    this._sort();

    if (this._entries.length > 5) {
        this._entries = this._entries.slice(0, 5);
    }
}

function updateScore(score, name) {
    let entries = readHighscore(highscorePath);
    entries.push
    const data = JSON.stringify(this._entries);
    try {
        fs.writeFileSync(highscorePath, 'test', 'utf8');
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    readHighscore: readHighscore,
    updateScore: updateScore
};