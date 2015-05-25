var PORT_NUMBER = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var HashMap = require('hashmap');

var Player = require('./server/Player').Player;
var Bullet = require('./server/Bullet').Bullet;
var HealthPack = require('./server/HealthPack').HealthPack;

var clients = new HashMap();
var bullets = [];
var healthpacks = [];

app.set('port', PORT_NUMBER);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

// Server side input handler, modifies the state of the players and the
// game based on the input it receives. Everything runs synchronously with
// the game loop.
io.on('connection', function(socket) {
  // When a new player joins, the server sends his/her unique ID back so
  // for future identification purposes.
  socket.on('new-player', function(data) {
    var x = Math.floor(Math.random() * 2441) + 30;
    var y = Math.floor(Math.random() * 2441) + 30;
    var orientation = Math.random() * 3 * Math.PI;
    var player = new Player(x, y, orientation, data, socket.id);
    clients.set(socket.id, player);
    socket.emit('send-id', {
      id: socket.id,
      players: clients.values()
    });
  });

  socket.on('move-player', function(data) {
    var player = clients.get(data.id);
    player.update(data.keyboardState, data.turretAngle);
    clients.set(socket.id, player);
  });

  socket.on('fire-bullet', function(data) {
    var player = clients.get(data.firedBy);
    var time = (new Date()).getTime();
    if (time > player.lastShotTime + Player.SHOT_COOLDOWN) {
      bullets.push(new Bullet(player.x, player.y,
                              player.turretAngle, player.id));
      player.lastShotTime = time;
    }
  });

  // TODO: player disconnect explosion animation?
  socket.on('disconnect', function() {
    if (clients.has(socket.id)) {
      clients.remove(socket.id);
    }
  });
});

// Server side game loop, runs at 60Hz and sends out update packets to all
// clients every tick.
setInterval(function() {
  for (var i = 0; i < bullets.length; ++i) {
    if (bullets[i].shouldExist) {
      bullets[i].update(clients);
    } else {
      bullets.splice(i, 1);
      i--;
    }
  }

  while (healthpacks.length < 3) {
    healthpacks.push(HealthPack.generateRandomHealthPack());
  }
  for (var i = 0; i < healthpacks.length; ++i) {
    if (healthpacks[i].shouldExist) {
      healthpacks[i].update(clients.values());
    } else {
      healthpacks.splice(i, 1);
      i--;
    }
  }
  io.sockets.emit('update-players', clients.values());
  io.sockets.emit('update-bullets', bullets);
  io.sockets.emit('update-healthpacks', healthpacks);
}, FRAME_RATE);

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
