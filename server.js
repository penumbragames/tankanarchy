/**
 * This is the server app script that is run on the server.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var PORT_NUMBER = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

// Dependencies.
var async = require('async');
var bodyParser = require('body-parser');
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var socketIo = require('socket.io');
var swig = require('swig');

var Game = require('./server/Game');

// Initialization.
var app = express();
var server = http.Server(app);
var game = new Game();

app.engine('html', swig.renderFile);

app.set('port', PORT_NUMBER);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(':date[web] :method :url :req[header] :remote-addr :status'));
app.use('/bower_components',
        express.static(__dirname + '/bower_components'));
app.use('/node_modules',
        express.static(__dirname + '/node_modules'));
app.use('/static',
        express.static(__dirname + '/static'));

app.get('/', function(request, response) {
  response.render('index.html');
});

// Server side input handler, modifies the state of the players and the
// game based on the input it receives. Everything runs synchronously with
// the game loop.
var io = socketIo(server);
io.on('connection', function(socket) {
  console.log('hit');
  // When a new player joins, the server sends his/her unique ID back so
  // for future identification purposes.
  socket.on('new-player', function(data) {
    game.addNewPlayer(data.name, socket.id);
    socket.emit('send-id', {
      id: socket.id,
      players: game.getPlayers()
    });
  });

  socket.on('move-player', function(data) {
    game.updatePlayer(socket.id, data.keyboardState, data.turretAngle);
  });

  // TODO: player shooting sound and explosion animations
  socket.on('fire-bullet', function() {
    game.addProjectile(socket.id);
  });

  // TODO: player disconnect explosion animation?
  socket.on('disconnect', function() {
    game.removePlayer(socket.id);
  });
});

// Server side game loop, runs at 60Hz and sends out update packets to all
// clients every tick.
setInterval(function() {
  game.update(io);
}, FRAME_RATE);

// Starts the server.
server.listen(PORT_NUMBER);
console.log('Starting server on port ' + PORT_NUMBER);
