/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  var socket = io();
  var game = Game.create(socket,
                         document.getElementById('canvas'),
                         document.getElementById('leaderboard'));
  var chat = Chat.create(socket,
                         document.getElementById('chat-display'),
                         document.getElementById('chat-input'));

  Input.applyEventHandlers(document.getElementById('canvas'));
  Input.addMouseTracker(document.getElementById('canvas'));
  AFK_Kicker.init();

  $('#name-input').focus();

  function send_name() {
    var name = $('#name-input').val();
    if (name && name.length < 20) {
      $('#name-prompt-container').empty();
      $('#name-prompt-container').append(
          $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'));
      socket.emit('new-player', {
        name: name
      }, function() {
        $('#name-prompt-overlay').fadeOut(500);
        $('#canvas').focus();
        game.animate();
      });
    } else {
      window.alert('Your name cannot be blank or over 20 characters.');
    }
    return false;
  };
  $('#name-form').submit(send_name);
  $('#name-submit').click(send_name);

  setInterval(function() {
    AFK_Kicker.check();
  }, 1000);
});
