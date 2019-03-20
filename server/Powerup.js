/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

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
    super(Vector.zero(), Vector.zero(), Vector.zero(),
      Constants.POWERUP_HITBOX_SIZE)

    this.name = null
    this.data = null
    this.duration = null

    this.expirationTime = null
    this.destroyed = false
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
    switch (this.type) {
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
