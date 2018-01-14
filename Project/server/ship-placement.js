const SCHLACHTSCHIFF_LENGTH = 5;
const KREUZER_LENGTH = 4;
const ZERSTOERER_LENGTH = 3;
const UBOOT_LENGTH = 2;

const HORIZONTAL = 0;
const VERTICAL = 1;

/**
 * Erstellt ein zufälliges Spielfeld und gibt es zurück.
 */
function randomPlayGround() {
	var ships = [generateShip(SCHLACHTSCHIFF_LENGTH), generateShip(KREUZER_LENGTH), generateShip(KREUZER_LENGTH), generateShip(ZERSTOERER_LENGTH), generateShip(ZERSTOERER_LENGTH), generateShip(ZERSTOERER_LENGTH), generateShip(UBOOT_LENGTH), generateShip(UBOOT_LENGTH), generateShip(UBOOT_LENGTH), generateShip(UBOOT_LENGTH)];
	var playground = [
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

	for (let i = 0; i < ships.length; i++) {
		ships[i] = placeShipRandom(ships[i]);
		if (checkShipPos(playground, ships[i])) {
			//console.log("Schiff platziert: X:" + ships[i].startX + ", Y:" + ships[i].startY + ", l:" + ships[i].length + ", d:" + ships[i].dir);
			playground = placeShip(playground, ships[i]);
		} else {
			i--;
		}
	}
	return playground;
}

/**
 * Generiert ein Schiff und gibt es zurück.
 * @param {any} shipLength ist die übergebene Schiffslänge
 */
function generateShip(shipLength) {
	var ship = {
		startX: 0,
		startY: 0,
		length: shipLength,
		dir: 0
	};
	return ship;
}

/**
 * Platziert das übergebene Schiff zufällig
 * @param {any} ship
 */
function placeShipRandom(ship) {
	ship.dir = randomNumber(0, 1);
	switch (ship.dir) {
		case HORIZONTAL:
			switch (ship.length) {
				case SCHLACHTSCHIFF_LENGTH:
					ship.startX = randomNumber(0, 9 - SCHLACHTSCHIFF_LENGTH);
					ship.startY = randomNumber(0, 9);
					break;
				case KREUZER_LENGTH:
					ship.startX = randomNumber(0, 9 - KREUZER_LENGTH);
					ship.startY = randomNumber(0, 9);
					break;
				case ZERSTOERER_LENGTH:
					ship.startX = randomNumber(0, 9 - ZERSTOERER_LENGTH);
					ship.startY = randomNumber(0, 9);
					break;
				case UBOOT_LENGTH:
					ship.startX = randomNumber(0, 9 - UBOOT_LENGTH);
					ship.startY = randomNumber(0, 9);
			}
			break;
		case VERTICAL:
			switch (ship.length) {
				case SCHLACHTSCHIFF_LENGTH:
					ship.startX = randomNumber(0, 9);
					ship.startY = randomNumber(0, 9 - SCHLACHTSCHIFF_LENGTH);
					break;
				case KREUZER_LENGTH:
					ship.startX = randomNumber(0, 9);
					ship.startY = randomNumber(0, 9 - KREUZER_LENGTH);
					break;
				case ZERSTOERER_LENGTH:
					ship.startX = randomNumber(0, 9);
					ship.startY = randomNumber(0, 9 - ZERSTOERER_LENGTH);
					break;
				case UBOOT_LENGTH:
					ship.startX = randomNumber(0, 9);
					ship.startY = randomNumber(0, 9 - UBOOT_LENGTH);
			}
	}
	return ship;
}

/**
 * Prüfe, ob das Schiff auf dem Spielfeld platziert werden kann
 * @param {any} playground Spielfeld
 * @param {any} ship Schiff
 */
function checkShipPos(playground, ship) {
	switch (ship.dir) {
		case HORIZONTAL:
			//vor dem Schiff
			if (ship.startX - 1 >= 0) {
				if (playground[ship.startX - 1][ship.startY] == 1) {
					return false;
				}
			}
			//hinter dem Schiff
			if (ship.startX + ship.length <= 9) {
				if (playground[ship.startX + ship.length][ship.startY] == 1) {
					return false;
				}
			}
			//auf dem Schiff
			for (let i = 0; i < ship.length; i++) {
				if (playground[ship.startX + i][ship.startY] == 1) {
					return false;
				}
			}
			//neben dem Schiff
			for (let i = 0; i < ship.length; i++) {
				if (ship.startY - 1 >= 0 && playground[ship.startX + i][ship.startY - 1] == 1) {
					return false;
				} else {
					//  console.log("CHECK: X:" + (ship.startX + i) + ", Y:" + (ship.startY - 1) + " SHIP X:" +  ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir)
				}
				if (ship.startY + 1 <= 9 && playground[ship.startX + i][ship.startY + 1] == 1) {
					return false;
				} else {
					//  console.log("CHECK: X:" + (ship.startX + i) + ", Y:" + (ship.startY + 1) + " SHIP X:" +  ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir)
				}
			}
			break;
		case VERTICAL:
			//vor dem Schiff
			if (ship.startY - 1 >= 0) {
				if (playground[ship.startX][ship.startY - 1] == 1) {
					return false;
				}
			}
			//hinter dem Schiff
			if (ship.startY + ship.length <= 9) {
				if (playground[ship.startX][ship.startY + ship.length] == 1) {
					return false;
				}
			}
			//auf dem Schiff
			for (let i = 0; i < ship.length; i++) {
				if (playground[ship.startX][ship.startY + i] == 1) {
					return false;
				}
			}
			//neben dem Schiff
			for (let i = 0; i < ship.length; i++) {
				if (ship.startX - 1 >= 0 && playground[ship.startX - 1][ship.startY + i] == 1) {
					return false;
				} else {
					//console.log("CHECK: X:" + (ship.startX - 1) + ", Y:" + (ship.startY + i) + " SHIP X:" +ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir);
				}

				if (ship.startX + 1 <= 9 && playground[ship.startX + 1][ship.startY + i] == 1) {
					return false;
				} else {
					//console.log("CHECK: X:" + (ship.startX + 1) + ", Y:" + (ship.startY + i) + " SHIP X:" +ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir)
				}
			}
	}
	return true;
}

/**
 * Platziert das Schiff auf dem Spielfeld
 * @param {any} playground Spielfeld
 * @param {any} ship Schiff
 */
function placeShip(playground, ship) {
	switch (ship.dir) {
		case HORIZONTAL:
			for (let i = 0; i < ship.length; i++) {
				playground[ship.startX + i][ship.startY] = 1;
			}
			break;
		case VERTICAL:
			for (let i = 0; i < ship.length; i++) {
				playground[ship.startX][ship.startY + i] = 1;
			}
	}
	return playground;
}

/**
 * Generiert eine zufällige Nummer zwischen min und max
 * @param {any} min
 * @param {any} max
 */
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	randomPlayGround: randomPlayGround
};