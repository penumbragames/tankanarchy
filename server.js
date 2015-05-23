var PORT_NUMBER = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

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
    var player = new Player(100, 100, data, socket.id);
    clients.set(socket.id, player);
    socket.emit('send-id', socket.id);
  });

  socket.on('move-player', function(data) {
    var player = clients.get(data.id);
    player.update(data.keyboardState);
    clients.set(socket.id, player);
  });

  socket.on('disconnect', function() {
    if (clients.has(socket.id)) {
      clients.remove(socket.id);
    }
  });
});

setInterval(function() {
  io.sockets.emit('update-players', clients.values());
}, FRAME_RATE);

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
