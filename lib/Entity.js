/**
 * Wrapper class for all entities that need basic physics.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Constants = require('./Constants')
const Util = require('./Util')
const Vector = require('./Vector')

/**
 * Entity class.
 */
class Entity {
  /**
   * Constructor for an Entity class. All entities will inherit from this class.
   * @constructor
   * @param {Array<number>} [position=[0, 0]] The position vector
   * @param {Array<number>} [velocity=[0, 0]] The velocity vector
   * @param {Array<number>} [acceleration=[0, 0]] The acceleration vector
   * @param {number} [hitboxSize=1] The entity's hitbox radius
   */
  constructor(position = [0, 0], velocity = [0, 0], acceleration = [0, 0],
    hitboxSize = 1) {
    this.position = Vector.fromArray(position)
    this.velocity = Vector.fromArray(velocity)
    this.acceleration = Vector.fromArray(acceleration)
    this.hitboxSize = hitboxSize
  }

  /**
   * Returns true if this Entity's hitbox is overlapping or touching another
   * Entity's hitbox.
   * @param {Entity} other The Entity to check collision against
   * @return {boolean}
   */
  collided(other) {
    const minDistance = this.hitboxSize + other.hitboxSize
    return Vector.sub(this.position, other.position).mag2 <=
      minDistance * minDistance
  }

  /**
   * Returns true if this Entity is inside the bounds of the game environment
   * world.
   * @return {boolean}
   */
  inWorld() {
    return Util.inBound(this.x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(this.y, Constants.WORLD_MIN, Constants.WORLD_MAX)
  }

  /**
   * Bounds this Entity's position within the game world if it is outside of the
   * game world.
   */
  boundToWorld() {
    this.position.x = Util.bound(
      this.position.x, Constants.WORLD_MIN, Constants.WORLD_MAX)
    this.position.y = Util.bound(
      this.position.y, Constants.WORLD_MIN, Constants.WORLD_MAX)
  }
}

module.exports = Entity
