/**
 * Wrapper class for all entities on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Vector = require('../shared/Vector')

/**
 * Entity class.
 */
class Entity {
  /**
   * All entities will inherit from this class.
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

    this.lastUpdateTime = 0
    this.deltaTime = 0
  }

  /**
   * Updates the entity's deltatime.
   */
  update() {
    const currentTime = Date.now()
    if (this.lastUpdateTime === 0) {
      this.deltaTime = 0
    } else {
      this.deltaTime = (currentTime - this.lastUpdateTime) / 1000
    }
    this.lastUpdateTime = currentTime
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
}

module.exports = Entity
