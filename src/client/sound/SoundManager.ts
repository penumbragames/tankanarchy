/**
 *
 */

import { Socket as SocketServer } from 'socket.io'
import { Socket as SocketClient } from 'socket.io-client'

import { SOUND_MAPPING } from 'client/sound/SoundMapping'
import SOUNDS from 'client/sound/Sounds'
import { SOCKET } from 'lib/Interfaces'
import Vector from 'lib/Vector'
import Player from 'server/Player'

type SOUND_EVENT = {
  type: SOUNDS
  volume: number
  source: Vector
}

export default class SoundManager {
  socket: SocketClient | SocketServer

  player: Player | null

  constructor(socket: SocketClient | SocketServer) {
    this.socket = socket
    this.player = null
  }

  bindClientListener() {
    this.socket.on(SOCKET.SOUND_EVENT, this.clientCallback.bind(this))
  }

  clientCallback(data: SOUND_EVENT) {
    SOUND_MAPPING[data.type].play()
  }

  update(player: Player) {
    this.player = player
  }
}
