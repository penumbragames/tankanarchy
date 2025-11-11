/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import PARTICLES from 'lib/enums/Particles'
import POWERUPS from 'lib/enums/Powerups'
import SOUNDS from 'lib/enums/Sounds'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import Powerup from 'lib/game/Powerup'
import { PlayerInputs } from 'lib/socket/SocketInterfaces'
import { Socket, SocketServer } from 'lib/socket/SocketServer'
import GameServices from 'server/GameServices'

export default class Game {
  socketServer: SocketServer
  services: GameServices

  // Contains all the connected socket ids and socket instances.
  clients: Map<string, Socket> = new Map()
  // Contains all the connected socket ids and the players associated with
  // them. This should always be parallel with sockets.
  players: Map<string, Player> = new Map()
  projectiles: Bullet[] = []
  powerups: Powerup[] = []

  lastUpdateTime: number = 0
  deltaTime: number = 0

  constructor(socket: SocketServer) {
    this.socketServer = socket
    this.services = new GameServices(socket)
  }

  static create(socket: SocketServer): Game {
    return new Game(socket).init()
  }

  init(): Game {
    this.lastUpdateTime = Date.now()
    return this
  }

  /**
   * Creates a new player with the given name and ID.
   * @param {string} name The display name of the player.
   * @param {Object} playerSocket The socket object of the player.
   */
  addNewPlayer(name: string, playerSocket: Socket): void {
    this.clients.set(playerSocket.id, playerSocket)
    this.players.set(playerSocket.id, Player.create(name, playerSocket.id))
  }

  /**
   * Removes the player with the given socket ID and returns the name of the
   * player removed.
   * @param {string} socketID The socket ID of the player to remove.
   * @return {string}
   */
  removePlayer(socketID: string): string {
    if (this.clients.has(socketID)) {
      this.clients.delete(socketID)
    }
    if (this.players.has(socketID)) {
      const p = this.players.get(socketID)
      if (p) {
        this.players.delete(socketID)
        return p.name
      }
      return ''
    }
    return ''
  }

  /**
   * Returns the name of the player with the given socket id.
   * @param {string} socketID The socket id to look up.
   * @return {string}
   */
  getPlayerNameBySocketId(socketID: string): string {
    const p = this.players.get(socketID)
    return p ? p.name : ''
  }

  /**
   * Updates the player with the given socket ID according to the input state
   * object sent by the player's client.
   * @param {string} socketID The socket ID of the player to update
   * @param {Object} data The player's input state
   */
  updatePlayerOnInput(socketID: string, data: PlayerInputs) {
    const player = this.players.get(socketID)
    if (player) {
      player.updateOnInput(data)
      if (data.shootBullet && player.canShoot()) {
        const projectiles = player.getProjectilesFromShot()
        this.projectiles.push(...projectiles)
        this.services.playSound(SOUNDS.TANK_SHOT, player.position)
      }
    }
  }

  update(): void {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    // Perform physics update and collision checks.
    const entities = [
      ...this.players.values(),
      ...this.projectiles,
      ...this.powerups,
    ]

    // TODO: Use quadtree for collision update
    entities.forEach((entity) => {
      entity.update(this.lastUpdateTime, this.deltaTime)
    })
    for (let i = 0; i < entities.length; ++i) {
      for (let j = i + 1; j < entities.length; ++j) {
        let e1 = entities[i]
        let e2 = entities[j]
        if (!e1.collided(e2)) {
          continue
        }

        // Player-Bullet collision interaction
        if (e1 instanceof Bullet && e2 instanceof Player) {
          e1 = entities[j]
          e2 = entities[i]
        }
        if (e1 instanceof Player && e2 instanceof Bullet && e2.source !== e1) {
          e1.damage(e2.damage)
          if (e1.isDead()) {
            e1.spawn()
            e1.deaths++
            e2.source.kills++
          }
          e2.destroyed = true
          this.services.playSound(SOUNDS.EXPLOSION, e1.position)
        }

        // Player-Powerup collision interaction
        if (e1 instanceof Powerup && e2 instanceof Player) {
          e1 = entities[j]
          e2 = entities[i]
        }
        if (e1 instanceof Player && e2 instanceof Powerup) {
          const type = e1.applyPowerup(e2)
          switch (type) {
            case POWERUPS.HEALTH_PACK:
              this.services.playSound(SOUNDS.HEALTH_PACK, e1.position)
              break
            case POWERUPS.RAPIDFIRE:
            case POWERUPS.SHOTGUN:
              this.services.playSound(SOUNDS.GUN_POWERUP, e1.position)
              break
          }
          e2.destroyed = true
        }

        // Bullet-Bullet interaction
        if (
          e1 instanceof Bullet &&
          e2 instanceof Bullet &&
          e1.source !== e2.source
        ) {
          e1.destroyed = true
          e2.destroyed = true
          this.services.playSound(SOUNDS.EXPLOSION, e1.position)
        }

        // Bullet-Powerup interaction
        if (
          (e1 instanceof Powerup && e2 instanceof Bullet) ||
          (e1 instanceof Bullet && e2 instanceof Powerup)
        ) {
          e1.destroyed = true
          e2.destroyed = true
          this.services.playSound(SOUNDS.EXPLOSION, e1.position)
          this.services.addParticle(PARTICLES.EXPLOSION, e1.position, {})
        }
      }
    }

    // Remove destroyed projectiles and powerups.
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.destroyed,
    )
    this.powerups = this.powerups.filter((powerup) => !powerup.destroyed)

    // Spawn new powerups.
    while (this.powerups.length < Powerup.MAX_COUNT) {
      this.powerups.push(Powerup.create())
    }
  }

  sendState(): void {
    const players = [...this.players.values()]
    this.clients.forEach((client, socketID) => {
      const currentPlayer = this.players.get(socketID)!
      client.emit(SOCKET_EVENTS.GAME_UPDATE, {
        self: currentPlayer,
        players: players,
        projectiles: this.projectiles,
        powerups: this.powerups,
      })
    })
  }
}
