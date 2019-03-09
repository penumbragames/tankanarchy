/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Bullet = require('./Bullet')
const Entity = require('./Entity')
const Powerup = require('./Powerup')
const World = require('./World')

const Constants = require('../shared/Constants')
const Util = require('../shared/Util')
const Vector = require('../shared/Vector')

/**
 * Player class.
 * @extends Entity
 */
class Player extends Entity {
  /**
   * Constructor for a Player object.
   * @param {string} name The name of the Player
   * @param {string} socketID The associated socket ID
   * @param {Vector} position The Player's starting ID
   * @param {number} angle The Player's starting tank angle
   */
  constructor(name, socketID, position, angle) {
    super(position)

    this.name = name
    this.socketID = socketID

    this.tankAngle = angle
    this.turretAngle = angle

    this.turnRate = 0
    this.speed = Constants.PLAYER_DEFAULT_SPEED
    this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN
    this.lastShotTime = 0
    this.health = Constants.PLAYER_MAX_HEALTH
    this.hitboxSize = Constants.PLAYER_DEFAULT_HITBOX_SIZE

    /**
     * The variable this.powerups is a JSON Object of the format:
     * { 'powerup' : { 'name' : name,
     *                 'data' : data,
     *                 'expirationTime' : expirationTime },
     *   'powerup' : { 'name' : name,
     *                 'data' : data,
     *                 'expirationTime' : expirationTime }
     * }
     */
    this.powerups = {}

    this.kills = 0
    this.deaths = 0
  }

  /**
   * Creates a new Player object.
   * @param {string} name The name of the Player
   * @param {string} socketID The associated socket ID
   * @return {Player}
   */
  static create(name, socketID) {
    return new Player(
      name, socketID, World.getRandomPoint(), Util.randRange(0, 2 * Math.PI))
  }

  /**
   * Update this player given the client's input data from Input.js
   * @param {Object} data A JSON Object storing the input state
   */
  updateOnInput(data) {
    const keyboardState = data.keyboardState
    if (keyboardState.up) {
      this.velocity = Vector.fromPolar(this.speed, this.tankAngle)
    } else if (keyboardState.down) {
      this.velocity = Vector.fromPolar(-this.speed, this.tankAngle)
    } else if (!(keyboardState.up ^ keyboardState.down)) {
      this.velocity = Vector.zero()
    }

    if (this.keyboardState.right) {
      this.turnRate = Player.TURN_RATE
    } else if (keyboardState.left) {
      this.turnRate = -Player.TURN_RATE
    } else if (!(keyboardState.left ^ keyboardState.right)) {
      this.turnRate = 0
    }

    this.turretAngle = data.orientation
  }

  /**
   * Performs a physics update.
   */
  update() {
    super()
    this.position.add(Vector.scale(this.velocity, this.deltaTime))
    this.orientation += this.turnRate * this.deltaTime

    this.position = World.bound(this.position.x, this.position.y)
  }

  /**
   * Updates the Player's powerups.
   */
  updatePowerups() {
    // TODO: fix powerup implementation
    for (const powerup in this.powerups) {
      switch (powerup) {
      case Powerup.HEALTHPACK:
        this.health = Math.min(this.health + this.powerups[powerup].data,
          Player.MAX_HEALTH)
        delete this.powerups[powerup]
        continue
      case Powerup.SHOTGUN:
        break
      case Powerup.RAPIDFIRE:
        this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN /
                            this.powerups[powerup].data
        break
      case Powerup.SPEEDBOOST:
        this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE *
            this.powerups[powerup].data
        break
      case Powerup.SHIELD:
        this.hitboxSize = Player.SHIELD_HITBOX_SIZE
        if (this.powerups[powerup].data <= 0) {
          delete this.powerups[powerup]
          this.hitboxSize = Player.DEFAULT_HITBOX_SIZE
          continue
        }
        break
      }
      if ((new Date()).getTime() > this.powerups[powerup].expirationTime) {
        switch (powerup) {
        case Powerup.HEALTHPACK:
          break
        case Powerup.SHOTGUN:
          break
        case Powerup.RAPIDFIRE:
          this.shotCooldown = Player.DEFAULT_SHOT_COOLDOWN
          break
        case Powerup.SPEEDBOOST:
          this.vmag = Player.DEFAULT_VELOCITY_MAGNITUDE
          break
        case Powerup.SHIELD:
          this.hitboxSize = Player.DEFAULT_HITBOX_SIZE
          break
        }
        delete this.powerups[powerup]
      }
    }
  }

  /**
   * Applies a Powerup to this player.
   * @param {Powerup} powerup The Powerup object.
   */
  applyPowerup(powerup) {
    this.powerups[powerup.type] = powerup
  }

  /**
   * Returns a boolean indicating if the player can shoot.
   * @return {boolean}
   */
  canShoot() {
    return this.currentTime > this.lastShotTime + this.shotCooldown
  }

  /**
   * Returns an array containing new projectile objects as if the player has
   * fired a shot given their current powerup state. This function does not
   * perform a shot cooldown check and resets the shot cooldown.
   * @return {Array<Bullet>}
   */
  getProjectilesFromShot() {
    const bullets = [
      Bullet.create(this.position, this.turretAngle, this.socketId)]
    const shotgunPowerup = this.powerups[Powerup.SHOTGUN]
    if (shotgunPowerup) {
      for (let i = 1; i <= shotgunPowerup.data; ++i) {
        const angleDeviation = i * Math.PI / 9
        bullets.push(
          Bullet.create(this.position, this.turretAngle - angleDeviation,
            this.socketId))
        bullets.push(
          Bullet.create(this.position, this.turretAngle + angleDeviation,
            this.socketId)
        )
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
   * Handles the respawning of the player to a new point.
   */
  respawn() {
    this.position = new Vector(
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING),
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING))
    this.health = Constants.PLAYER_MAX_HEALTH
    this.deaths++
  }
}

module.exports = Player
