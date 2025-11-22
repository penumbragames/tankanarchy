/**
 * Provider for server side game services to allow other classes to access
 * and modify game state, spawn particles, trigger sounds, etc.
 * @author omgimanerd
 */

import random from 'random'

import PARTICLES from 'lib/enums/Particles'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import { UpdateFrame } from 'lib/game/component/Updateable'
import Entity from 'lib/game/entity/Entity'
import Vector from 'lib/math/Vector'
import { SoundEvent } from 'lib/socket/SocketInterfaces'
import { SocketServer } from 'lib/socket/SocketServer'
import Game from 'server/Game'

export type ParticleDrawingOptions = {
  // differs from particle to particle
  size: number
}

export type ExplosionOptions = {
  // dictates the size of the individual explosion particles that make up the
  // explosion
  size: number
  // dictates the spatial spread that explosion particles can generate
  spread: number
  // dictates the number of explosion particles
  density: number
  // dictates the maximum delay to spawn explosion particles, particles are
  // normally distributed over the delay period
  delay: number
}

export class GameServices {
  game: Game

  // TODO: instead of emitting the socket event whenever the relevant methods
  // are called, maybe we should buffer them all up in this class, and send
  // them in batches with the game update instead.
  socket: SocketServer

  constructor(game: Game, socket: SocketServer) {
    this.game = game
    this.socket = socket
  }

  get updateFrame(): UpdateFrame {
    return this.game.gameLoop.updateFrame
  }

  playSound(e: SoundEvent): void {
    this.socket.sockets.emit(SOCKET_EVENTS.SOUND, e)
  }

  addParticle(
    type: PARTICLES,
    position: Vector,
    options: Partial<ParticleDrawingOptions>,
  ): void {
    this.socket.sockets.emit(SOCKET_EVENTS.PARTICLE, {
      type,
      source: position,
      options: options,
    })
  }

  addExplosion(position: Vector, options: ExplosionOptions): void {
    const spread = random.normal(0, options.spread)
    const delayFn = random.uniformInt(0, options.delay)
    for (let i = 0; i < options.density; ++i) {
      const delay = delayFn()
      const newPosition = position.copy().add(new Vector(spread(), spread()))
      setTimeout(() => {
        this.socket.sockets.emit(SOCKET_EVENTS.PARTICLE, {
          type: PARTICLES.EXPLOSION,
          source: newPosition,
          options: {
            size: options.size,
          },
        })
      }, delay)
    }
  }

  addEntity(...entities: Entity[]) {
    this.game.entities.push(...entities)
  }
}
