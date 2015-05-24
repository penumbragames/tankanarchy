var PORT_NUMBER = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var HashMap = require('hashmap');

var Player = require('./server/Player').Player;
var Bullet = require('./server/Bullet').Bullet;

var clients = new HashMap();
var bullets = [];

app.set('port', PORT_NUMBER);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

io.on('connection', function(socket) {
  socket.on('new player', function(data) {
    var x = Math.floor(Math.random() * 2441) + 30;
    var y = Math.floor(Math.random() * 2441) + 30;
    var orientation = Math.random() * 3 * Math.PI
    var player = new Player(x, y, orientation, data, socket.id);
    clients.set(socket.id, player);
    socket.emit('send-id', {
      id: socket.id,
      players: clients.values()
    });
  });

  socket.on('move-player', function(data) {
    try {
      var player = clients.get(data.id);
      player.update(data.keyboardState, data.turretAngle);
      clients.set(socket.id, player);
    } catch (err) {}
  });

  socket.on('fire-bullet', function(data) {
    var player = clients.get(data.firedBy);
    var time = (new Date()).getTime();
    if (time > player.lastShotTime_ + Player.SHOT_COOLDOWN) {
      bullets.push(new Bullet(player.x_, player.y_,
                              player.turretAngle_, player.id_));
      player.lastShotTime_ = time;
    }
  });

  socket.on('disconnect', function() {
    if (clients.has(socket.id)) {
      clients.remove(socket.id);
    }
  });
});

setInterval(function() {
  for (var i = 0; i < bullets.length; ++i) {
    if (bullets[i].shouldExist()) {
      bullets[i].update(clients);
    } else {
      bullets.splice(i, 1);
      i--;
    }
  }
  io.sockets.emit('update-players', clients.values());
  io.sockets.emit('update-bullets', bullets);
}, FRAME_RATE);

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
