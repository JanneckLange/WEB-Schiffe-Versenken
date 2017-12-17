function getScore() {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', 'http://52.166.12.116:3000/api/highscore', true);
  xhttp.responseType = 'json';
  xhttp.onload = () => {
    var data = xhttp.response;
    if (data !== null) {
      var array = getData(data);

      printData(array);
    }
  };
  xhttp.send(null);
}

function getData(text) {
  var j = 0;
  var array = [];
  var nameToInsert = 0;
  var pointsA = [];
  var pointsA2 = [];
  var pointsASize = 0;
  var nameInPA = false;
  var arrayPos = 0;
  var arrayPos2 = 0;

  try {
    while (text.highscore[j].name != 'undefined') {
      j++;
    }
  } catch (e) {

  }

  for (var i = 0; i < j; i++) {
    if (text.highscore[i].name != null) {
      array[arrayPos] = text.highscore[i].points + " " + text.highscore[i].name;
      arrayPos++;
    }
  }

  for (var k = 0; k < j; k++) {
    if (text.highscore[k].name != null) {
      pointsA[arrayPos2] = parseInt ( text.highscore[k].points );
      arrayPos2++;
      pointsASize++;
    }
  }

  pointsA.sort(function(a, b){return a-b});


  for (var g = 0; g < j; g++) {
    if (text.highscore[g].name != null) {

      for (var m = 0; m < j; m++) {
        if(pointsA[g] == text.highscore[m].points){

          for(var n = 0; n < pointsASize; n++){
            if(String(pointsA[n]).includes( text.highscore[m].name )){
              nameInPA = true;
            }
          }
            if(!nameInPA){
              nameToInsert = m;
              m = j;
            }
      }

    }
    if(!nameInPA){
    pointsA2[arrayPos2] = pointsA[g] + " " + text.highscore[nameToInsert].name;
    arrayPos2++;
    }
    nameInPa = false;
  }}
    pointsA2.splice(0, pointsASize);

  return pointsA2;
}

function printData(array) {
  var textField = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5']
  var pointField = ['po1', 'po2', 'po3', 'po4', 'po5']
  for (var i = 0; i < array.length && i < textField.length; i++) {
    document.getElementById(textField[i]).textContent = "" + (i + 1) + ". " + array[i].split(" ")[1];
    document.getElementById(pointField[i]).textContent = array[i].split(" ")[0];
  }
}

function getShips( player ) {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', 'http://52.166.12.116:3000/api/ships', true);
  xhttp.responseType = 'json';
  xhttp.onload = () => {
    var data = xhttp.response;
    if (data !== null) {

      printShips(data, player);


    }
  };
  xhttp.send(null);
}

function shootSquare ( id ){

  alert("SHOOOOOOT´s fired on " + id + "!");

}


function printShips(data, player){

  var row = 0;
  var square = 0;

if (player == 1){
  for(var i = 100 ; i <= 199 ; i++ ){

      document.getElementById(i).textContent = data[row][square];
        square++;

        if(square == 10){
          row++;
          square = 0;
        }
  }

  for(var i = 100 ; i <= 199 ; i++ ){
    if(document.getElementById(i).textContent == "1"){
      document.getElementById(i).textContent = "";
      document.getElementById(i).style.background ="#000000";
    }
    if(document.getElementById(i).textContent == "0"){
      document.getElementById(i).textContent = "";
      document.getElementById(i).style.background ="#0000ff";
    }
        square++;

        if(square == 10){
          row++;
          square = 0;
        }
  }
}

if (player == 2){
  for(var i = 200 ; i <= 299 ; i++ ){

      document.getElementById(i).textContent = data[row][square];
        square++;

        if(square == 10){
          row++;
          square = 0;
        }
  }

  for(var i = 200 ; i <= 299 ; i++ ){
    if(document.getElementById(i).textContent == "1"){
      document.getElementById(i).textContent = "";
      document.getElementById(i).style.background ="#000000";
    }
    if(document.getElementById(i).textContent == "0"){
      document.getElementById(i).textContent = "";
      document.getElementById(i).style.background ="#0000ff";
    }
        square++;

        if(square == 10){
          row++;
          square = 0;
        }
  }
}

row=0;
square=0;
}
