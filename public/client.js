var socket = io();
var game = new Game();

var nickname = window.prompt('Enter a nickname.');
while (nickname == '' || nickname == null) {
  nickname = window.prompt(
    'Not a valid nickname.');
}
var player = new Player(100, 100, nickname);
socket.emit('new player', player);

function init() {
  game.setPlayer(player);
}

function animate() {
  game.update();
  game.draw();
  window.requestAnimFrame(animate);
}

$(document).ready(function() {
  KeyboardBuffer.applyEventHandlers();

  $('#button').click(function() {
    socket.emit('query players', '');
    console.log(KeyboardBuffer.LEFT);
  });
});

socket.on("new player", function() {
});
socket.on("move player", function() {
});
socket.on("remove player", function() {
});

