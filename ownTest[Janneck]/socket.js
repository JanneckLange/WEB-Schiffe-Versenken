url = "ws://localhost:8080";
w = new WebSocket(url);

w.onopen = function() {
  log("open web socet");
  w.send("thank you");
}
w.onmessage = function(e) {
  log(e.data.toString());
}
w.onclose = function(e) {
  log("closed");
}
w.onerror = function(e) {
  log("error");
}

window.onload = function() {
  document.getElementById("sendButton").onclick = function() {
    w.send(document.getElementById("inputMessage").value);
  }
}

function log(s) {
  var logOutput = document.getElementById("logOutput");
  var el = $("#logOutput").after('<p>' + s + '</p>');
  $("p").slice(2).addClass("highlight");
}