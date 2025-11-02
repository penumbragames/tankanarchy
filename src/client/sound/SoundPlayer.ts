/**
 * Client side handler for sound events to actually play the corresponding
 * audio asset.
 * @author omgimanerd
 */

import { SOUND_MAPPING } from 'client/sound/SoundMapping'
import Vector from 'lib/math/Vector'
import { SocketClient } from 'lib/socket/SocketClient'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'
import { SoundEvent } from 'lib/socket/SocketInterfaces'

export default class SoundPlayer {
  socket: SocketClient

  listenerPosition: Vector | null

  constructor(socket: SocketClient) {
    this.socket = socket
    this.listenerPosition = null
  }

  bindClientListener() {
    this.socket.on(SOCKET_EVENTS.SOUND, this.clientCallback.bind(this))
  }

  clientCallback(data: SoundEvent) {
    SOUND_MAPPING[data.type].play()
  }

  update(position: Vector) {
    this.listenerPosition = position
  }
}
