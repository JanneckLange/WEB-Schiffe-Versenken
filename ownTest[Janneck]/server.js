var WebSocketServer = require('ws').Server;

var ws = new WebSocketServer({
  port: 8080
});

ws.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('recived: %s', message);
    ws.send('from server --' + message);
  });
});