/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var socket = io();
var game = Game.create(socket,
                       document.getElementById('canvas'),
                       document.getElementById('leaderboard'));
var chat = Chat.create(socket,
                       document.getElementById('chat-display'),
                       document.getElementById('chat-input'));

$(document).ready(function() {
  $('#name-input').focus();

  function send_name() {
    name = $('#name-input').val();
    if (name && name != '' && name.length < 20) {
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

  socket.on('received-new-player', function(data) {
    // This is fired when the server receives the instance of our player.
    // When we receive our ID, we will associate it to our Game object and
    // start the game.
    $('#name-prompt-overlay').fadeOut(500);
    init();
    animate();
  });
});

function init() {
  Input.applyEventHandlers();
  AFK_Kicker.init();
  game.init();
  chat.init();
};

function animate() {
  AFK_Kicker.check();
  game.update();
  game.draw();
  window.requestAnimFrame(animate);
};
