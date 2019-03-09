/**
 * This class stores the state of a bullet on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Entity = require('./Entity')
const Player = require('./Player')
const Powerup = require('./Powerup')

const Constants = require('../shared/Constants')
const Vector = require('../../shared/Vector')

/**
 * Bullet class.
 */
class Bullet extends Entity {
  /**
   * Constructor for a Bullet object.
   * @constructor
   * @param {Vector} position The starting position vector
   * @param {Vector} velocity The starting velocity vector
   * @param {number} angle The orientation of the bullet
   * @param {Player} source The Player object firing the bullet
   */
  constructor(position, velocity, angle, source) {
    super(position, velocity)

    this.angle = angle
    this.source = source

    this.damage = Constants.BULLET_DEFAULT_DAMAGE
    this.originPoint = position.copy()
    this.shouldExist = true
  }

  /**
   * Creates a new Bullet object from a Player object firing it.
   * @param {Player} player The Player object firing the bullet
   * @param {number} [angleDeviation=0] The angle deviation if the bullet is
   *   not traveling in the direction of the turret
   * @return {Bullet}
   */
  static createFromPlayer(player, angleDeviation = 0) {
    const angle = player.turretAngle + angleDeviation
    return new Bullet(
      player.position.copy(),
      Vector.fromPolar(Constants.BULLET_VELOCITY_MAGNITUDE, angle),
      angle,
      player
    )
  }

  /**
   * Performs a physics update.
   */
  update() {
    super()

    const distanceTraveled = Vector.sub(this.position, this.originPoint).mag2
    if (this.inWorld() || distanceTraveled > Bullet.MAX_TRAVEL_DISTANCE_SQ) {
      this.shouldExist = false
    }
  }

  /**
   * Performs a collision update with another Entity.
   * @param {Entity} object The colliding Entity
   */
  updateOnCollision(object) {
    if (object instanceof Bullet || object instanceof Powerup) {
      this.shouldExist = false
      object.shouldExist = false
    } else if (object instanceof Player) {
      object.damage(this.damage)
      if (object.isDead()) {
        object.respawn()
        object.deaths++
        this.source.kills++
      }
      this.shouldExist = false
    }
  }
}

module.exports = Bullet
