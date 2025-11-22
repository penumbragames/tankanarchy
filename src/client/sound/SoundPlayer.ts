/**
 * Client side handler for sound events to actually play the corresponding
 * audio asset.
 * @author omgimanerd
 */

import type { Nullable } from 'lib/types'

import SOUND_MAP from 'client/sound/Sounds'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import MathUtil from 'lib/math/MathUtil'
import Vector from 'lib/math/Vector'
import { SocketClient } from 'lib/socket/SocketClient'
import { SoundEvent } from 'lib/socket/SocketInterfaces'

export default class SoundPlayer {
  static readonly MAX_DISTANCE = 1000 // px

  socket: SocketClient

  listenerPosition: Nullable<Vector> = null

  constructor(socket: SocketClient) {
    this.socket = socket
  }

  bindClientListener() {
    this.socket.on(SOCKET_EVENTS.SOUND, this.clientCallback.bind(this))
  }

  clientCallback(data: SoundEvent) {
    if (!this.listenerPosition) return
    const d = Vector.sub(data.source, this.listenerPosition).mag
    if (d > SoundPlayer.MAX_DISTANCE) return
    // TODO, implement volume slider scaling
    SOUND_MAP[data.type].play(
      MathUtil.lerp(d, SoundPlayer.MAX_DISTANCE, 0, 0, 0.4),
    )
  }

  update(position: Vector) {
    this.listenerPosition = position
  }
}
