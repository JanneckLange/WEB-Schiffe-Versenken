function getScore() {
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', 'http://52.166.12.116:3000/api/highscore', true);
  xhttp.responseType = 'json';
  xhttp.onload = () => {
    var data = xhttp.response;
    if (data !== null) {
      var array = getData(data);
      array.sort();
      printData(array);
    }
  };
  xhttp.send(null);
}

function getData(text) {
  var j = 0;
  var array = [];
  var arrayPos = 0;

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
  return array;
}

function printData(array) {
  alert(array);
  var textField = ['pl1', 'pl2', 'pl3', 'pl4', 'pl5', 'pl6', 'pl7', 'pl8', 'pl9', 'pl10', ]
  var pointField = ['po1', 'po2', 'po3', 'po4', 'po5', 'po6', 'po7', 'po8', 'po9', 'po10', ]
  for (var i = 0; i < array.length && i < textField.length; i++) {
    document.getElementById(textField[i]).textContent = "" + (i + 1) + ". " + array[i].split(" ")[1];
    document.getElementById(pointField[i]).textContent = array[i].split(" ")[0];
  }
}