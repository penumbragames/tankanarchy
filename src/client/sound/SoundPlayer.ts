/**
 * Client side handler for sound events to actually play the corresponding
 * audio asset.
 * @author omgimanerd
 */

import type { Nullable } from 'lib/types/types'

import SOUND_MAP from 'client/sound/Sounds'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import Sound from 'client/sound/Sound'
import MathUtil from 'lib/math/MathUtil'
import Vector from 'lib/math/Vector'
import { SocketClient } from 'lib/socket/SocketClient'
import { SOUND_ACTION, SoundEvent } from 'lib/socket/SocketInterfaces'

export default class SoundPlayer {
  static readonly MAX_DISTANCE = 1000 // px

  socket: SocketClient

  // Active playing sounds that we are storing
  activeSounds: Map<string, Sound> = new Map()
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
    const soundPrototype = SOUND_MAP[data.type]
    const volume =
      d > SoundPlayer.MAX_DISTANCE
        ? 0
        : MathUtil.lerp(d, SoundPlayer.MAX_DISTANCE, 0, 0, 0.4)

    switch (data.action) {
      case undefined: // an unset action defaults to playing the sound
      case SOUND_ACTION.PLAY:
        const sound = soundPrototype.play(volume) // clones the shit
        if (data.id) {
          this.activeSounds.set(data.id, sound)
        }
        break
      case SOUND_ACTION.PAUSE:
        if (!data.id) break
        this.activeSounds.get(data.id)?.pause()
        break
      case SOUND_ACTION.MOVE:
        if (!data.id) break
        const activeSound = this.activeSounds.get(data.id)
        if (activeSound) activeSound.volume = volume
        break
    }

    for (const [id, sound] of this.activeSounds.entries()) {
      if (sound.played) this.activeSounds.delete(id)
    }
  }

  update(position: Vector) {
    this.listenerPosition = position
  }
}
