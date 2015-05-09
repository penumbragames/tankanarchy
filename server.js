var PORT_NUMBER = process.env.PORT || 5000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', PORT_NUMBER);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public' + req.path);
});

io.on('connection', function(socket) {
  socket.on('add shit', function(msg) {
    io.emit('add shit', msg);
  });
});

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
