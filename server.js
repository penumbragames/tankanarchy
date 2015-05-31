var PORT_NUMBER = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var HashMap = require('hashmap');

var Player = require('./server/Player').Player;
var Bullet = require('./server/Bullet').Bullet;
var Powerup = require('./server/Powerup').Powerup;

// TODO: refactor to server-side Game class.
var clients = new HashMap();
var bullets = [];
var powerups = [];

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
    var player = Player.generateNewPlayer(data.name, socket.id);
    clients.set(socket.id, player);
    socket.emit('send-id', {
      id: socket.id,
      players: clients.values()
    });
  });

  socket.on('move-player', function(data) {
    var player = clients.get(data.id);
    if (player != undefined && player != null) {
      player.update(data.keyboardState, data.turretAngle);
      clients.set(socket.id, player);
    }
  });

  // TODO: player shooting sound and explosion animations
  socket.on('fire-bullet', function(data) {
    var player = clients.get(data.firedBy);
    if (player != undefined && player != null && player.canShoot()) {
      bullets = bullets.concat(player.getBulletsShot());
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
      io.sockets.emit('explosion', bullets.splice(i, 1));
      i--;
    }
  }

  // Ensure that there are always 6 powerups on the map.
  while (powerups.length < 6) {
    powerups.push(Powerup.generateRandomPowerup());
  }
  for (var i = 0; i < powerups.length; ++i) {
    if (powerups[i].shouldExist) {
      powerups[i].update(clients.values());
    } else {
      powerups.splice(i, 1);
      i--;
    }
  }

  // Sends update packets every client.
  io.sockets.emit('update-players', clients.values());
  io.sockets.emit('update-bullets', bullets);
  io.sockets.emit('update-powerups', powerups);
}, FRAME_RATE);

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
