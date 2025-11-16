/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import { Projectile } from 'lib/game/component/Projectile'
import Entity from 'lib/game/entity/Entity'
import Powerup from 'lib/game/entity/Powerup'
import GameLoop from 'lib/game/GameLoop'
import { PlayerInputs } from 'lib/socket/SocketInterfaces'
import { SocketServer } from 'lib/socket/SocketServer'
import CollisionHandler from 'server/CollisionHandler'
import GameServices from 'server/GameServices'
import PlayerContainer from 'server/PlayerContainer'

export default class Game {
  static readonly TARGET_UPS = 60

  socketServer: SocketServer
  services: GameServices

  players: PlayerContainer
  projectiles: Projectile[] = []
  powerups: Powerup[] = []

  gameLoop: GameLoop
  collisionHandler: CollisionHandler

  constructor(socketServer: SocketServer) {
    this.socketServer = socketServer
    this.services = new GameServices(this, socketServer)
    this.players = new PlayerContainer(socketServer)
    this.gameLoop = new GameLoop(Game.TARGET_UPS, this.run.bind(this))
    this.collisionHandler = new CollisionHandler(this.services)
  }

  static create(socket: SocketServer): Game {
    return new Game(socket)
  }

  start() {
    this.gameLoop.start()
  }

  /**
   * Game loop function that should run at the target UPS.
   */
  run(): void {
    this.update()
    this.sendState()
  }

  /**
   * Updates the player with the given socket ID according to the input state
   * object sent by the player's client.
   * @param {string} socketID The socket ID of the player to update
   * @param {Object} data The player's input state
   */
  updatePlayerOnInput(socketID: string, data: PlayerInputs) {
    this.players.getPlayer(socketID)?.updateOnInput(data, this.services)
  }

  update(): void {
    // Perform physics update and collision checks.
    const entities: Entity[] = [
      ...this.players.players,
      ...this.projectiles,
      ...this.powerups,
    ]
    entities.forEach((entity: Entity) => {
      entity.update(this.gameLoop.updateFrame, this.services)
    })
    this.collisionHandler.run(entities)

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

  /**
   * Broadcasts the game's current state to all connected players.
   */
  sendState(): void {
    const players = [...this.players.players]
    for (const socket of this.players.sockets) {
      const currentPlayer = this.players.getPlayer(socket.id)!
      socket.emit(SOCKET_EVENTS.GAME_UPDATE, {
        self: currentPlayer,
        players: players,
        projectiles: this.projectiles,
        powerups: this.powerups,
      })
    }
  }
}
