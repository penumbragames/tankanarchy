/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Bullet = require('./Bullet')
const Powerup = require('./Powerup')

const Constants = require('../lib/Constants')
const Entity = require('../lib/Entity')
const Util = require('../lib/Util')
const Vector = require('../lib/Vector')

/**
 * Player class.
 * @extends Entity
 */
class Player extends Entity {
  /**
   * Constructor for a Player object.
   * @constructor
   * @param {string} name The display name of the player
   * @param {string} socketID The associated socket ID
   * @param {Vector} position The player's starting location
   * @param {number} angle The player's starting tank angle
   */
  constructor(name, socketID) {
    super()

    this.name = name
    this.socketID = socketID

    this.lastUpdateTime = 0
    this.tankAngle = 0
    this.turretAngle = 0
    this.turnRate = 0
    this.speed = Constants.PLAYER_DEFAULT_SPEED
    this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN
    this.lastShotTime = 0
    this.health = Constants.PLAYER_MAX_HEALTH
    this.hitboxSize = Constants.PLAYER_DEFAULT_HITBOX_SIZE

    this.powerups = {}

    this.kills = 0
    this.deaths = 0
  }

  /**
   * Creates a new Player object.
   * @param {string} name The display name of the player
   * @param {string} socketID The associated socket ID
   * @return {Player}
   */
  static create(name, socketID) {
    const player = new Player(name, socketID)
    player.spawn()
    return player
  }

  /**
   * Update this player given the client's input data from Input.js
   * @param {Object} data A JSON Object storing the input state
   */
  updateOnInput(data) {
    if (data.up) {
      this.velocity = Vector.fromPolar(this.speed, this.tankAngle)
    } else if (data.down) {
      this.velocity = Vector.fromPolar(-this.speed, this.tankAngle)
    } else if (!(data.up ^ data.down)) {
      this.velocity = Vector.zero()
    }

    if (data.right) {
      this.turnRate = Constants.PLAYER_TURN_RATE
    } else if (data.left) {
      this.turnRate = -Constants.PLAYER_TURN_RATE
    } else if (!(data.left ^ data.right)) {
      this.turnRate = 0
    }

    this.turretAngle = data.turretAngle
  }

  /**
   * Performs a physics update.
   * @param {number} lastUpdateTime The last timestamp an update occurred
   * @param {number} deltaTime The timestep to compute the update with
   */
  update(lastUpdateTime, deltaTime) {
    this.lastUpdateTime = lastUpdateTime
    this.position.add(Vector.scale(this.velocity, deltaTime))
    this.boundToWorld()
    this.tankAngle = Util.normalizeAngle(
      this.tankAngle + this.turnRate * deltaTime)

    this.updatePowerups()
  }

  /**
   * Updates the Player's powerups.
   */
  updatePowerups() {
    for (const type of Constants.POWERUP_KEYS) {
      const powerup = this.powerups[type]
      if (!powerup) {
        continue
      }
      switch (type) {
      case Constants.POWERUP_HEALTHPACK:
        this.health = Math.min(
          this.health + powerup.data, Constants.PLAYER_MAX_HEALTH)
        this.powerups[type] = null
        break
      case Constants.POWERUP_SHOTGUN:
        break
      case Constants.POWERUP_RAPIDFIRE:
        this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN / powerup.data
        break
      case Constants.POWERUP_SPEEDBOOST:
        this.speed = Constants.PLAYER_DEFAULT_SPEED * powerup.data
        break
      case Constants.POWERUP_SHIELD:
        this.hitboxSize = Constants.PLAYER_SHIELD_HITBOX_SIZE
        if (powerup.data <= 0) {
          this.powerups[type] = null
          this.hitboxSize = Constants.PLAYER_DEFAULT_HITBOX_SIZE
        }
        break
      }
      if (this.lastUpdateTime > powerup.expirationTime) {
        switch (type) {
        case Constants.POWERUP_HEALTHPACK:
          break
        case Constants.POWERUP_SHOTGUN:
          break
        case Constants.POWERUP_RAPIDFIRE:
          this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN
          break
        case Constants.POWERUP_SPEEDBOOST:
          this.speed = Constants.PLAYER_DEFAULT_SPEED
          break
        case Constants.POWERUP_SHIELD:
          this.hitboxSize = Constants.PLAYER_DEFAULT_HITBOX_SIZE
          break
        }
        this.powerups[type] = null
      }
    }
  }

  /**
   * Applies a Powerup to this player.
   * @param {Powerup} powerup The Powerup object.
   */
  applyPowerup(powerup) {
    powerup.expirationTime = this.lastUpdateTime + powerup.duration
    this.powerups[powerup.type] = powerup
  }

  /**
   * Returns a boolean indicating if the player can shoot.
   * @return {boolean}
   */
  canShoot() {
    return this.lastUpdateTime > this.lastShotTime + this.shotCooldown
  }

  /**
   * Returns an array containing new projectile objects as if the player has
   * fired a shot given their current powerup state. This function does not
   * perform a shot cooldown check and resets the shot cooldown.
   * @return {Array<Bullet>}
   */
  getProjectilesFromShot() {
    const bullets = [Bullet.createFromPlayer(this)]
    const shotgunPowerup = this.powerups[Constants.POWERUP_SHOTGUN]
    if (shotgunPowerup) {
      for (let i = 1; i <= shotgunPowerup.data; ++i) {
        const angleDeviation = i * Math.PI / 9
        bullets.push(Bullet.createFromPlayer(this, -angleDeviation))
        bullets.push(Bullet.createFromPlayer(this, angleDeviation))
      }
    }
    this.lastShotTime = this.lastUpdateTime
    return bullets
  }

  /**
   * Returns a boolean determining if the player is dead or not.
   * @return {boolean}
   */
  isDead() {
    return this.health <= 0
  }

  /**
   * Damages the player by the given amount, factoring in shields.
   * @param {number} amount The amount to damage the player by
   */
  damage(amount) {
    if (this.powerups[Powerup.SHIELD]) {
      this.powerups[Powerup.SHIELD].data -= 1
    } else {
      this.health -= amount
    }
  }

  /**
   * Handles the spawning (and respawning) of the player.
   */
  spawn() {
    this.position = new Vector(
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING),
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING))
    this.angle = Util.randRange(0, 2 * Math.PI)
    this.health = Constants.PLAYER_MAX_HEALTH
  }
}

module.exports = Player
