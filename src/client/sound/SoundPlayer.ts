/**
 *
 */

import { Socket as SocketServer } from 'socket.io'
import { Socket as SocketClient } from 'socket.io-client'

import { SOUND_MAPPING } from 'client/sound/SoundMapping'
import { SOCKET } from 'lib/Interfaces'
import Vector from 'lib/math/Vector'
import SOUNDS from 'lib/sound/Sounds'

type SOUND_EVENT = {
  type: SOUNDS
  volume: number
  source: Vector
}

export default class SoundPlayer {
  socket: SocketClient | SocketServer

  listenerPosition: Vector | null

  constructor(socket: SocketClient | SocketServer) {
    this.socket = socket
    this.listenerPosition = null
  }

  bindClientListener() {
    this.socket.on(SOCKET.SOUND_EVENT, this.clientCallback.bind(this))
  }

  clientCallback(data: SOUND_EVENT) {
    SOUND_MAPPING[data.type].play()
  }

  update(position: Vector) {
    this.listenerPosition = position
  }
}
