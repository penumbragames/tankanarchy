var PORT_NUMBER = 3000;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  socket.on('add shit', function(msg) {
    io.emit('add shit', msg);
  });
});

http.listen(PORT_NUMBER, function() {
  console.log('Listening to port ' + PORT_NUMBER);
});
