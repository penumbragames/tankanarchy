/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants'
import * as socket from 'socket.io'
import Bullet from './Bullet'
import Player from './Player'
import Powerup from './Powerup'

class Game {
  clients: Map<string, socket.Socket>

  players: Map<string, Player>
  projectiles: Bullet[]
  powerups: Powerup[]

  lastUpdateTime: number
  deltaTime: number

  constructor() {
    // Contains all the connected socket ids and socket instances.
    this.clients = new Map()
    // Contains all the connected socket ids and the players associated with
    // them. This should always be parallel with sockets.
    this.players = new Map()
    this.projectiles = []
    this.powerups = []

    this.lastUpdateTime = 0
    this.deltaTime = 0
  }

  static create(): Game {
    const game = new Game()
    game.init()
    return game
  }

  init(): void {
    this.lastUpdateTime = Date.now()
  }

  /**
   * Creates a new player with the given name and ID.
   * @param {string} name The display name of the player.
   * @param {Object} playerSocket The socket object of the player.
   */
  addNewPlayer(name: string, playerSocket: socket.Socket): void {
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
  updatePlayerOnInput(socketID: string, data: Constants.PLAYER_INPUTS): void {
    const player = this.players.get(socketID)
    if (player) {
      player.updateOnInput(data)
      if (data.shoot && player.canShoot()) {
        const projectiles = player.getProjectilesFromShot()
        this.projectiles.push(...projectiles)
      }
    }
  }

  /**
   * Updates the state of all the objects in the game.
   */
  update(): void {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    /**
     * Perform a physics update and collision update for all entities
     * that need it.
     */
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
        }

        // Player-Powerup collision interaction
        if (e1 instanceof Powerup && e2 instanceof Player) {
          e1 = entities[j]
          e2 = entities[i]
        }
        if (e1 instanceof Player && e2 instanceof Powerup) {
          e1.applyPowerup(e2)
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
        }

        // Bullet-Powerup interaction
        if (
          (e1 instanceof Powerup && e2 instanceof Bullet) ||
          (e1 instanceof Bullet && e2 instanceof Powerup)
        ) {
          e1.destroyed = true
          e2.destroyed = true
        }
      }
    }

    /**
     * Filters out destroyed projectiles and powerups.
     */
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.destroyed,
    )
    this.powerups = this.powerups.filter((powerup) => !powerup.destroyed)

    /**
     * Repopulate the world with new powerups.
     */
    while (this.powerups.length < Constants.POWERUP_MAX_COUNT) {
      this.powerups.push(Powerup.create())
    }
  }

  /**
   * Sends the state of the game to all connected players.
   */
  sendState(): void {
    const players = [...this.players.values()]
    this.clients.forEach((_client, socketID) => {
      const currentPlayer = this.players.get(socketID)
      this.clients.get(socketID)!.emit(Constants.SOCKET.UPDATE, {
        self: currentPlayer,
        players: players,
        projectiles: this.projectiles,
        powerups: this.powerups,
      })
    })
  }
}

export default Game
