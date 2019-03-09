/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Entity = require('./Entity')
const Player = require('./Player')

const Constants = require('../shared/Constants')
const Util = require('../shared/Util')
const Vector = require('../shared/Vector')

/**
 * Powerup class.
 * @extends Entity
 */
class Powerup extends Entity {
  /**
   * Constructor for Powerup object.
   * @param {string} name The type of powerup
   * @param {number} data Data associated with the powerup
   * @param {number} duration The duration that the powerup will last on the
   *   player after being picked up, if it is not instant use
   * @param {Vector} position The location of the powerup
   */
  constructor(name, data, duration, position) {
    super(position)

    this.name = name
    this.data = data
    this.duration = duration

    this.hitboxSize = Constants.POWERUP_HITBOX_SIZE
    this.expirationTime = 0
    this.shouldExist = true
  }

  /**
   * Creates a new Powerup object randomly placed in the world.
   * @return {Powerup}
   */
  static create() {
    const type = Util.choiceArray(Constants.POWERUP_KEYS)
    const dataRanges = Constants.POWERUP_DATA[type]
    let data = null
    switch (name) {
    case Constants.POWERUP_HEALTHPACK:
      data = Util.randRangeInt(dataRanges.MIN, dataRanges.MAX + 1)
      break
    case Constants.POWERUP_SHOTGUN:
      data = Util.randRangeInt(dataRanges.MIN, dataRanges.MAX + 1)
      break
    case Constants.POWERUP_RAPIDFIRE:
      data = Util.randRange(dataRanges.MIN, dataRanges.MAX)
      break
    case Constants.POWERUP_SPEEDBOOST:
      data = Util.randRange(dataRanges.MIN, dataRanges.MAX)
      break
    case Constants.POWERUP_SHIELD:
      data = Util.randRangeInt(dataRanges.MIN, dataRanges.MAX + 1)
      break
    }
    const duration = Util.randRange(Powerup.MIN_DURATION, Powerup.MAX_DURATION)
    const position = new Vector(
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING),
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING))
    return new Powerup(type, data, duration, position)
  }

  /**
   * Performs a collision update with another Entity.
   * @param {Entity} object The colliding Entity
   */
  updateOnCollision(object) {
    if (object instanceof Player) {
      object.applyPowerup(this)
      this.expirationTime = Date.now() + this.duration
      this.shouldExist = false
    }
  }
}

module.exports = Powerup
