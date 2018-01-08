function randomPlayGround() {
  var ships = [generateShip(SCHLACHTSCHIFF_TYPE), generateShip(KREUZER_TYPE), generateShip(KREUZER_TYPE), generateShip(ZERSTOERER_TYPE), generateShip(ZERSTOERER_TYPE), generateShip(ZERSTOERER_TYPE), generateShip(UBOOT_TYPE), generateShip(UBOOT_TYPE), generateShip(UBOOT_TYPE), generateShip(UBOOT_TYPE)];
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

  for (var i = 0; i < ships.length; i++) {
    ships[i] = placeShipRandom(ships[i]);
    if (checkShipPos(playground, ships[i])) {
      playground = placeShip(playground, ships[i]);
    } else {
      i--;
    }
  }
}

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

//prüfe ob das schiff auf dem Spielfeld platziert werden kann
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
      if (ship.startX + ship.length + 1 <= 9) {
        if (playground[ship.startX + ship.length + 1][ship.startY] == 1) {
          return false;
        }
      }
      //auf dem Schiff
      for (var i = 0; i < ship.length; i++) {
        if (playground[ship.startX + i][ship.startY] == 1) {
          return false;
        }
      }
      //neben dem Schiff
      for (var i = 0; i < ship.length; i++) {
        if (ship.startY - 1 >= 0) {
          if (playground[ship.startX + i][ship.startY] == 1) {
            return false;
          }
        }
        if (ship.startY + ship.length + 1 <= 9) {
          if (playground[ship.startX + i][ship.startY] == 1) {
            return false;
          }
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
      if (ship.startY + ship.length + 1 <= 9) {
        if (playground[ship.startX][ship.startY + ship.length + 1] == 1) {
          return false;
        }
      }
      //auf dem Schiff
      for (var i = 0; i < ship.length; i++) {
        if (playground[ship.startX][ship.startY + i] == 1) {
          return false;
        }
      }
      //neben dem Schiff
      for (var i = 0; i < ship.length; i++) {
        if (ship.startX - 1 >= 0) {
          if (playground[ship.startX][ship.startY + i] == 1) {
            return false;
          }
        }
        if (ship.startX + ship.length + 1 <= 9) {
          if (playground[ship.startX][ship.startY + i] == 1) {
            return false;
          }
        }
      }
  }
  return true;
}

function placeShip(ship) {
  switch (ship.dir) {
    case HORIZONTAL:
      for (var i = 0; i < ship.length; i++) {
        playground[ship.startX + i][ship.startY] = 1;
      }
      break;
    case VERTICAL:
      for (var i = 0; i < ship.length; i++) {
        playground[ship.startX][ship.startY + i] = 1;
      }
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}