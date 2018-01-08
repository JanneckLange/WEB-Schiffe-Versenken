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

  for (var i = 0; i < ships.length; i++) {
    ships[i] = placeShipRandom(ships[i]);
    if (checkShipPos(playground, ships[i])) {
      console.log("Schiff platziert: X:" + ships[i].startX + ", Y:" + ships[i].startY + ", l:" + ships[i].length + ", d:" + ships[i].dir);
      playground = placeShip(playground, ships[i]);
    } else {
      i--;
    }
  }
  return playground;
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
      if (ship.startX + ship.length <= 9) {
        if (playground[ship.startX + ship.length][ship.startY] == 1) {
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
        if (ship.startY - 1 >= 0 && playground[ship.startX + i][ship.startY - 1] == 1) {
          return false;
        } else {
          console.log("CHECK: X:" + (ship.startX + i) + ", Y:" + (ship.startY - 1) + " SHIP X:" +
            ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir)
        }
        if (ship.startY + 1 <= 9 && playground[ship.startX + i][ship.startY + 1] == 1) {
          return false;
        } else {
          console.log("CHECK: X:" + (ship.startX + i) + ", Y:" + (ship.startY + 1) + " SHIP X:" +
            ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir)
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
      for (var i = 0; i < ship.length; i++) {
        if (playground[ship.startX][ship.startY + i] == 1) {
          return false;
        }
      }
      //neben dem Schiff
      for (var i = 0; i < ship.length; i++) {
        if (ship.startX - 1 >= 0 && playground[ship.startX - 1][ship.startY + i] == 1) {
          return false;
        } else {
          console.log("CHECK: X:" + (ship.startX - 1) + ", Y:" + (ship.startY + i) + " SHIP X:" +
            ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir);
        }

        if (ship.startX + 1 <= 9 && playground[ship.startX + 1][ship.startY + i] == 1) {
          return false;
        } else {
          console.log("CHECK: X:" + (ship.startX + 1) + ", Y:" + (ship.startY + i) + " SHIP X:" +
            ship.startX + ", Y:" + ship.startY + ", l:" + ship.length + ", d:" + ship.dir)
        }
      }
  }
  return true;
}



function placeShip(playground, ship) {
  switch (ship.dir) {
    case HORIZONTAL:
      for (var i = 0; i < ship.length; i++) {
        playground[ship.startX + i][ship.startY] = 1;
        document.getElementById("" + 1 + "" + ship.startY + "" + (ship.startX + i)).style.background = backgroundColorShip;
      }
      break;
    case VERTICAL:
      for (var i = 0; i < ship.length; i++) {
        playground[ship.startX][ship.startY + i] = 1;
        document.getElementById("" + 1 + "" + (ship.startY + i) + "" + ship.startX).style.background = backgroundColorShip;
      }
  }
  return playground;
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}