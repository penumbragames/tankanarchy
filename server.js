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
    var player = new Player(100, 100, data);
    clients.set(socket.id, player);
    socket.emit('send-id', socket.id);

    io.sockets.emit('update-players', clients.values());
  });

  socket.on('move-player', function(data) {
    var player = clients.get(data.id);
    player.update(data.keyboardState);
    clients.set(socket.id, player);

    io.sockets.emit('update-players', clients.values());
  });

  socket.on('disconnect', function() {
    if (clients.has(socket.id)) {
      clients.remove(socket.id);
    }

    io.sockets.emit('update-players', clients.values());
  });
});

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
