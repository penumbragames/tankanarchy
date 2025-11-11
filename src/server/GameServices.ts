/**
 * Provider for server side game services like sending audio and particle
 * triggers.
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'
import SOUNDS from 'lib/enums/Sounds'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import Vector from 'lib/math/Vector'
import { SocketServer } from 'lib/socket/SocketServer'

export default class GameServices {
  socket: SocketServer

  constructor(socket: SocketServer) {
    this.socket = socket
  }

  playSound(type: SOUNDS, source: Vector): void {
    this.socket.sockets.emit(SOCKET_EVENTS.SOUND, {
      type,
      source,
    })
  }

  addParticle(type: PARTICLES, source: Vector, options: any /* TODO */): void {
    this.socket.sockets.emit(SOCKET_EVENTS.PARTICLE, {
      type,
      source,
    })
  }
}
