/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from './lib/Constants'
import * as socketIO from 'socket.io-client'
import * as socketIOParser from './lib/CustomSocketParser'
import Chat from './client/Chat'
import Game from './client/Game'

window.onload = (): void => {
  const socket = socketIO.io({
    parser: socketIOParser,
  })
  const game = Game.create(socket, 'canvas', 'leaderboard')
  Chat.create(socket, 'chat-display', 'chat-input')

  const nameInputElement = <HTMLInputElement>(
    document.getElementById('name-input')!
  )
  nameInputElement.focus()

  const sendName = (): boolean => {
    const name = nameInputElement.value
    document.getElementById('name-prompt-container')!.innerHTML = ''
    if (name && name.length < 20) {
      socket.emit(Constants.SOCKET.NEW_PLAYER, name, () => {
        document.getElementById('name-prompt-overlay')!.remove()
        document.getElementById('canvas')!.focus()
        game.run()
      })
    } else {
      window.alert('Your name cannot be blank or over 20 characters.')
    }
    return false
  }
  document.getElementById('name-form')!.addEventListener('submit', sendName)
  document.getElementById('name-submit')!.addEventListener('click', sendName)
}
