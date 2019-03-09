/**
 * Wrapper class for all entities on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Vector = require('../shared/Vector')

/**
 * Entity class for handling entity physics.
 */
class Entity {
  /**
   * All entities will inherit from this class.
   * @constructor
   * @param {Array<number>} [position=[0, 0]] The position vector
   * @param {Array<number>} [velocity=[0, 0]] The velocity vector
   * @param {Array<number>} [acceleration=[0, 0]] The acceleration vector
   * @param {number} [mass=1] The entity mass
   */
  constructor(position = [0, 0], velocity = [0, 0], acceleration = [0, 0],
    mass = 1) {
    this.position = Vector.fromArray(position)
    this.velocity = Vector.fromArray(velocity)
    this.acceleration = Vector.fromArray(acceleration)
    this.mass = mass

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
}

module.exports = Entity
