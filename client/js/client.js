/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

require('../less/styles.less')

const $ = require('jquery')
const io = require('socket.io-client')

const Chat = require('./game/Chat')
const Game = require('./game/Game')

$(document).ready(() => {
  const socket = io()
  const game = Game.create(socket, 'canvas', 'leaderboard')
  Chat.create(socket, 'chat-display', 'chat-input')

  $('#name-input').focus()

  /**
   * Function to send the player name to the server.
   * @return {false}
   */
  const sendName = () => {
    const name = $('#name-input').val()
    if (name && name.length < 20) {
      $('#name-prompt-container').empty()
      $('#name-prompt-container').append(
        $('<span>').addClass('fa fa-2x fa-spinner fa-pulse'))
      socket.emit('new-player', { name }, () => {
        $('#name-prompt-overlay').remove()
        $('#canvas').focus()
        game.run()
      })
    } else {
      window.alert('Your name cannot be blank or over 20 characters.')
    }
    return false
  }
  $('#name-form').submit(sendName)
  $('#name-submit').click(sendName)
})
