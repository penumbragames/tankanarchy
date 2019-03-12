/**
 * Game class on the server to manage the state of existing players and
 * and entities.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Player = require('./Player')
const Powerup = require('./Powerup')

const Constants = require('../shared/Constants')

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
    for (let i = 0; i < Constants.POWERUP_MAX_COUNT; ++i) {
      this.powerups.push(Powerup.create())
    }
  }

  /**
   * Creates a new player with the given name and ID.
   * @param {string} name The display name of the player.
   * @param {Object} socket The socket object of the player.
   */
  addNewPlayer(name, socket) {
    this.clients.set(socket.id, socket)
    this.players.set(socket.id, Player.generateNewPlayer(name, socket.id))
  }

  /**
   * Removes the player with the given socket ID and returns the name of the
   * player removed.
   * @param {string} socketID The socket ID of the player to remove.
   * @return {string}
   */
  removePlayer(socketID) {
    if (this.clients.has(socketID)) {
      this.clients.remove(socketID)
    }
    if (this.players.has(socketID)) {
      const player = this.players.get(socketID)
      this.players.remove(socketID)
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
        this.projectiles.push(...player.getProjectilesFromShot())
      }
    }
  }

  /**
   * Updates the state of all the objects in the game.
   */
  update() {
    /**
     * Perform a physics update and collision update for all entities.
     */
    const entities = [
      ...this.players.values(),
      ...this.powerups,
      ...this.projectiles
    ]
    entities.forEach(entity => entity.update)
    entities.forEach(entity1 => {
      entities.forEach(entity2 => {
        if (entity1 !== entity2) {
          if (entity1.collided(entity2)) {
            entity1.updateOnCollision(entity2)
          }
        }
      })
    })

    /**
     * Filters out destroyed projectiles.
     */
    this.projectiles = this.projectiles.filter(
      projectile => projectile.shouldExist)
  }

  /**
   * Sends the state of the game to all connected players.
   */
  sendState() {
    const players = Array.from(this.players.values().entries())
    const leaderboard = players.slice()
    leaderboard.sort((a, b) => {
      return b.kills - a.kills
    })
    this.clients.forEach((client, socketID) => {
      const currentPlayer = this.players.get(socketID)
      this.clients.get(socketID).emit(Constants.SOCKET_MESSAGE_UPDATE, {
        leaderboard: leaderboard,
        self: currentPlayer,
        players: players,
        projectiles: this.projectiles,
        powerups: this.powerups
      })
    })
  }
}

module.exports = Game
