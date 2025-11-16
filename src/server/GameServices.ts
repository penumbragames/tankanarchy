/**
 * Provider for server side game services like sending audio and particle
 * triggers.
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'
import SOUNDS from 'lib/enums/Sounds'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import { Projectile } from 'lib/game/component/Projectile'
import Vector from 'lib/math/Vector'
import { SocketServer } from 'lib/socket/SocketServer'
import Game from 'server/Game'

export default class GameServices {
  game: Game
  socket: SocketServer

  constructor(game: Game, socket: SocketServer) {
    this.game = game
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

  addProjectile(...projectiles: Projectile[]) {
    this.game.projectiles.push(...projectiles)
  }
}
