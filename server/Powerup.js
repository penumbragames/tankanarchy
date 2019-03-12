/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Player = require('./Player')

const Constants = require('../lib/Constants')
const Entity = require('../lib/Entity')
const Util = require('../lib/Util')
const Vector = require('../lib/Vector')

/**
 * Powerup class.
 * @extends Entity
 */
class Powerup extends Entity {
  /**
   * Constructor for a Powerup object.
   */
  constructor() {
    super()

    this.name = null
    this.data = null
    this.duration = null
    this.pickupTime = null

    this.hitboxSize = Constants.POWERUP_HITBOX_SIZE
  }

  /**
   * Creates a new Powerup object randomly placed in the world.
   * @return {Powerup}
   */
  static create() {
    const powerup = new Powerup()
    powerup.randomizeAttributes()
    return powerup
  }

  /**
   * Performs a collision update with another Entity. If the powerup is picked
   * up by a player, then it will be recycled by randomizing position to
   * simulate another powerup spawn.
   * @param {Entity} object The colliding Entity
   * @param {number} timestamp The timestamp of the collision
   */
  updateOnCollision(object, timestamp) {
    if (object instanceof Player) {
      object.applyPowerup(this)
      this.pickupTime = timestamp
    }
  }

  /**
   * Randomizes the position, type, data, and duration of the powerup.
   */
  randomizeAttributes() {
    this.position = new Vector(
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING),
      Util.randRange(Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING))
    this.type = Util.choiceArray(Constants.POWERUP_KEYS)
    const dataRanges = Constants.POWERUP_DATA[this.type]
    switch (name) {
    case Constants.POWERUP_HEALTHPACK:
      this.data = Util.randRangeInt(dataRanges.MIN, dataRanges.MAX + 1)
      break
    case Constants.POWERUP_SHOTGUN:
      this.data = Util.randRangeInt(dataRanges.MIN, dataRanges.MAX + 1)
      break
    case Constants.POWERUP_RAPIDFIRE:
      this.data = Util.randRange(dataRanges.MIN, dataRanges.MAX)
      break
    case Constants.POWERUP_SPEEDBOOST:
      this.data = Util.randRange(dataRanges.MIN, dataRanges.MAX)
      break
    case Constants.POWERUP_SHIELD:
      this.data = Util.randRangeInt(dataRanges.MIN, dataRanges.MAX + 1)
      break
    }
    this.duration = Util.randRange(Powerup.MIN_DURATION, Powerup.MAX_DURATION)
  }
}

module.exports = Powerup
