var socket = io();
var game = new Game(document.getElementById('canvas'), socket);

function send_nickname() {
  nickname = $('#nickname').val();
  if (verifyNickname(nickname)) {
    // Create an instance of the user's player and sends it.
    // The server will associate our socket id with this player and
    // any move commands will be sent with our ID after the server
    // sends back our ID.
    socket.emit('new player', nickname);
    $('#nickname-prompt-container').empty();
    $('#nickname-prompt-container').append(
      $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'));
  } else {
    window.alert('Invalid nickname.');
  }
  return false;
};
$('#nickname-form').submit(send_nickname);
$('#nickname-submit').click(send_nickname);

socket.on('send-id', function(data) {
  // This is fired when the server receives the instance of our player.
  // When we receive our ID, we will associate it to our Game object and
  // start the game.
  game.setID(data);
  $('#nickname-prompt-overlay').fadeOut(500);
  init();
  animate();
});

socket.on('update-players', function(data) {
  game.receivePlayers(data);
});

function init() {
  KeyboardBuffer.applyEventHandlers();
}

function animate() {
  game.update();
  game.draw();
  window.requestAnimFrame(animate);
}
