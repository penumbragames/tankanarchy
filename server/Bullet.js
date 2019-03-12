/**
 * This class stores the state of a bullet on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Player = require('./Player')
const Powerup = require('./Powerup')

const Constants = require('../lib/Constants')
const Entity = require('../lib/Entity')
const Vector = require('../lib/Vector')

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
    this.distanceTraveled = 0
    this.destroyed = false
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
      Vector.fromPolar(Constants.BULLET_SPEED, angle),
      angle,
      player
    )
  }

  /**
   * Performs a physics update.
   * @param {number} lastUpdateTime The last timestamp an update occurred
   * @param {number} deltaTime The timestep to compute the update with
   */
  update(lastUpdateTime, deltaTime) {
    const distanceStep = Vector.scale(this.velocity, deltaTime)
    this.position.add(distanceStep)
    this.distanceTraveled += distanceStep.mag2
    if (this.inWorld() || distanceStep > Bullet.MAX_TRAVEL_DISTANCE_SQ) {
      this.destroyed = true
    }
  }

  /**
   * Performs a collision update with another Entity.
   * @param {Entity} object The colliding Entity
   */
  updateOnCollision(object) {
    if (object instanceof Bullet || object instanceof Powerup) {
      this.destroyed = true
      object.destroyed = true
    } else if (object instanceof Player && this.source !== object) {
      object.damage(this.damage)
      if (object.isDead()) {
        object.respawn()
        object.deaths++
        this.source.kills++
      }
      this.destroyed = true
    }
  }
}

module.exports = Bullet
