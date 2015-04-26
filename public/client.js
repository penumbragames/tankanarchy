var socket = io();

$('#button').click(function() {
  socket.emit('add shit', 's');
});

socket.on('add shit', function(input) {
  $('#test').text("penis");
});
