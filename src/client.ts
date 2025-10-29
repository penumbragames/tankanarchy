/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import 'reflect-metadata'

import * as socketIO from 'socket.io-client'

import Chat from 'client/Chat'
import Game from 'client/Game'
import * as socketIOParser from 'lib/CustomSocketParser'
import * as Interfaces from 'lib/Interfaces'

window.onload = (): void => {
  const socket = socketIO.io({
    parser: socketIOParser,
  })
  const game = Game.create(socket, 'canvas', 'leaderboard')

  const nameInputElement = <HTMLInputElement>(
    document.getElementById('name-input')!
  )
  nameInputElement.focus()

  const sendName = () => {
    const name = DEBUG ? 'DEBUG_PLAYER' : nameInputElement.value
    document.getElementById('name-prompt-container')!.innerHTML = ''
    if (name && name.length < 20) {
      socket.emit(Interfaces.SOCKET.NEW_PLAYER, name, () => {
        document.getElementById('name-prompt-overlay')!.remove()
        document.getElementById('canvas')!.focus()
        game.run()
        Chat.create(socket, 'chat-display', 'chat-input')
      })
    } else {
      window.alert('Your name cannot be blank or over 20 characters.')
    }
  }

  if (DEBUG) {
    sendName()
  } else {
    document.getElementById('name-form')!.addEventListener('submit', sendName)
  }
}
