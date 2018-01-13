const shipPlacement = require(__dirname + "/ship-placement");

module.exports = class Player {
	constructor(id) {
		this._name;
		this._field;
		this._score;
		this._id = id;
		this.init();
	}

	set name(name) {
		this._name = name;
	}
	set field(field) {
		this._field = field;
	}

	get name() {
		return this._name;
	}
	get field() {
		return this._field;
	}
	get score() {
		return this._score;
	}
	get id() {
		return this._id;
	}

	increaseScore() {
		this._score++;
	}

	init() {
		this._score = 0;
		this._field = shipPlacement.randomPlayGround();
	}

};