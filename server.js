var PORT_NUMBER = process.env.PORT || 5000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var HashMap = require('hashmap');

var Player = require('./server/Player').Player;

var clients = new HashMap();

app.set('port', PORT_NUMBER);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

io.on('connection', function(socket) {
  socket.on('new player', function(data) {
    clients.set(socket, data);
  });
  socket.on('move player', function() {
  });
  socket.on('disconnect', function() {
    if (clients.has(socket)) {
      clients.remove(socket);
    }
  });
  socket.on('query players', function() {
  });
});

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
