/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Player = require('./Player')

const Constants = require('../shared/Constants')
const Entity = require('../shared/Entity')
const Util = require('../shared/Util')
const Vector = require('../shared/Vector')

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

    this.hitboxSize = Constants.POWERUP_HITBOX_SIZE
    this.expirationTime = 0
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
   * Performs an update on this entity to update its delta time.
   */
  update() {
    super()
  }

  /**
   * Performs a collision update with another Entity. If the powerup is picked
   * up by a player, then it will be recycled by randomizing position to
   * simulate another powerup spawn.
   * @param {Entity} object The colliding Entity
   */
  updateOnCollision(object) {
    if (object instanceof Player) {
      object.applyPowerup(this)
      this.expirationTime = this.lastUpdateTime + this.duration
      this.randomizeAttributes()
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
