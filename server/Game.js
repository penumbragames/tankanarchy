/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Bullet = require('./Bullet')
const Player = require('./Player')
const Powerup = require('./Powerup')

const Constants = require('../lib/Constants')

/**
 * Game class.
 */
class Game {
  /**
   * Constructor for a Game object.
   */
  constructor() {
    /**
     * This is a Map containing all the connected socket ids and socket
     * instances.
     */
    this.clients = new Map()
    /**
     * This is a Map containing all the connected socket ids and the players
     * associated with them. This should always be parallel with sockets.
     */
    this.players = new Map()
    this.projectiles = []
    this.powerups = []

    this.lastUpdateTime = 0
    this.deltaTime = 0
  }

  /**
   * Creates a new Game object.
   * @return {Game}
   */
  static create() {
    const game = new Game()
    game.init()
    return game
  }

  /**
   * Initializes the game state.
   */
  init() {
    this.lastUpdateTime = Date.now()
  }

  /**
   * Creates a new player with the given name and ID.
   * @param {string} name The display name of the player.
   * @param {Object} socket The socket object of the player.
   */
  addNewPlayer(name, socket) {
    this.clients.set(socket.id, socket)
    this.players.set(socket.id, Player.create(name, socket.id))
  }

  /**
   * Removes the player with the given socket ID and returns the name of the
   * player removed.
   * @param {string} socketID The socket ID of the player to remove.
   * @return {string}
   */
  removePlayer(socketID) {
    if (this.clients.has(socketID)) {
      this.clients.delete(socketID)
    }
    if (this.players.has(socketID)) {
      const player = this.players.get(socketID)
      this.players.delete(socketID)
      return player.name
    }
  }

  /**
   * Returns the name of the player with the given socket id.
   * @param {string} socketID The socket id to look up.
   * @return {string}
   */
  getPlayerNameBySocketId(socketID) {
    if (this.players.has(socketID)) {
      return this.players.get(socketID).name
    }
  }

  /**
   * Updates the player with the given socket ID according to the input state
   * object sent by the player's client.
   * @param {string} socketID The socket ID of the player to update
   * @param {Object} data The player's input state
   */
  updatePlayerOnInput(socketID, data) {
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
  update() {
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
      ...this.powerups
    ]
    entities.forEach(
      entity => { entity.update(this.lastUpdateTime, this.deltaTime) })
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
        if (e1 instanceof Player && e2 instanceof Bullet &&
          e2.source !== e1) {
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
        if (e1 instanceof Bullet && e2 instanceof Bullet &&
          e1.source !== e2.source) {
          e1.destroyed = true
          e2.destroyed = true
        }

        // Bullet-Powerup interaction
        if (e1 instanceof Powerup && e2 instanceof Bullet ||
          e1 instanceof Bullet && e2 instanceof Powerup) {
          e1.destroyed = true
          e2.destroyed = true
        }
      }
    }

    /**
     * Filters out destroyed projectiles and powerups.
     */
    this.projectiles = this.projectiles.filter(
      projectile => !projectile.destroyed)
    this.powerups = this.powerups.filter(
      powerup => !powerup.destroyed)

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
  sendState() {
    const players = [...this.players.values()]
    this.clients.forEach((client, socketID) => {
      const currentPlayer = this.players.get(socketID)
      this.clients.get(socketID).emit(Constants.SOCKET_UPDATE, {
        self: currentPlayer,
        players: players,
        projectiles: this.projectiles,
        powerups: this.powerups
      })
    })
  }
}

module.exports = Game
