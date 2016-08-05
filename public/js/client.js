/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
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
      $('#name-prompt-container').empty();
      $('#name-prompt-container').append(
          $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'));
      socket.emit('new-player', {
        name: name
      }, function() {
        $('#name-prompt-overlay').fadeOut(500);
        init();
        animate();
      });
    } else {
      window.alert('Your name cannot be blank or over 20 characters.');
    }
    return false;
  };
  $('#name-form').submit(send_name);
  $('#name-submit').click(send_name);
});

function init() {
  Input.applyEventHandlers(document.getElementById('canvas'));
  Input.addMouseTracker(document.getElementById('canvas'));
  AFK_Kicker.init();
  game.init();
  chat.init();
}

function animate() {
  AFK_Kicker.check();
  game.update();
  game.draw();
  window.requestAnimFrame(animate);
}
