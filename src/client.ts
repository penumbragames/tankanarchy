/**
 * Client side script that initializes the game. This should be the only script
 * that depends on JQuery.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import 'reflect-metadata'

import Game from 'client/Game'
import loadSprites from 'client/graphics/Sprites'
import { loadSounds } from 'client/sound/Sounds'
import Chat from 'client/ui/Chat'
import Debug from 'client/ui/Debug'
import { getSocketClient, SocketClient } from 'lib/socket/SocketClient'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

window.onload = async () => {
  // Must be called to asynchronously load sound and sprite assets.
  await Promise.all([loadSounds(), loadSprites()])

  const socket: SocketClient = getSocketClient()
  const game = Game.create(socket, 'canvas', 'leaderboard')
  Debug.init(
    socket,
    document.getElementById('debug-container')!,
    document.getElementById('debug-powerup-buttons')!,
    document.getElementById('debug-display')!,
  )

  const nameInputElement = <HTMLInputElement>(
    document.getElementById('name-input')!
  )
  nameInputElement.focus()

  const sendName = () => {
    const name = DEBUG ? 'DEBUG_PLAYER' : nameInputElement.value
    document.getElementById('name-prompt-container')!.innerHTML = ''
    if (name && name.length < 20) {
      socket.emit(SOCKET_EVENTS.NEW_PLAYER, name, () => {
        document.getElementById('name-prompt-overlay')!.remove()
        document.getElementById('canvas')!.focus()
        game.start()
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
