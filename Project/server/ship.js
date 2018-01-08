const SCHLACHTSCHIFF_LENGTH = 5;
const KREUZER_LENGTH = 4;
const ZERSTOERER_LENGTH = 3;
const UBOOT_LENGTH = 2;


function generateShip(shipLength) {
  var ship = {
    startX: 0,
    startY: 0,
    length: shipLength,
    dir: 0
  };
  return ship;
}