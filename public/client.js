var socket = io();
var game = new Game(document.getElementById('canvas'), socket);
var afk_kicker = new AFK_Kicker();

$(document).ready(function() {
  $('#name-input').focus();
});;

function send_name() {
  name = $('#name-input').val();
  if (name != '' && name != null && name.length < 20) {
    // Create an instance of the user's player and sends it.
    // The server will associate our socket id with this player and
    // any move commands will be sent with our ID after the server
    // sends back our ID.
    socket.emit('new-player', {
      name: name
    });
    $('#name-prompt-container').empty();
    $('#name-prompt-container').append(
      $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'));
  } else {
    window.alert('Your name cannot be blank or over 20 characters.');
  }
  return false;
};
$('#name-form').submit(send_name);
$('#name-submit').click(send_name);

socket.on('send-id', function(data) {
  // This is fired when the server receives the instance of our player.
  // When we receive our ID, we will associate it to our Game object and
  // start the game.
  game.setID(data.id);
  game.receivePlayers(data.players);
  $('#name-prompt-overlay').fadeOut(500);
  init();
  animate();
});

socket.on('update-players', function(data) {
  game.receivePlayers(data);
});

socket.on('update-projectiles', function(data) {
  game.receiveProjectiles(data);
});

socket.on('update-powerups', function(data) {
  game.receivePowerups(data);
});

socket.on('explosion', function(data) {
  game.createExplosion(data);
});

function init() {
  Input.applyEventHandlers();
  afk_kicker.init();
};

function animate() {
  //afk_kicker.check();
  game.update();
  game.draw();
  window.requestAnimFrame(animate);
};
