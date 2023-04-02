/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants'
import Entity from '../lib/Entity'
import Util from '../lib/Util'
import Vector from '../lib/Vector'

class Powerup extends Entity {
  position: Vector
  type: Constants.POWERUP_TYPES
  data: number
  duration: number
  expirationTime: number

  constructor(
    position: Vector,
    type: Constants.POWERUP_TYPES,
    data: number,
    duration: number,
  ) {
    super(position, Vector.zero(), Vector.zero(), Constants.POWERUP_HITBOX_SIZE)

    this.type = type
    this.data = data
    this.duration = duration
    this.expirationTime = 0

    this.destroyed = false
  }

  static create(): Powerup {
    const position = new Vector(
      Util.randRange(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
      Util.randRange(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
    )
    const type = <Constants.POWERUP_TYPES>(
      Util.choiceArray(Object.keys(Constants.POWERUP_TYPES))
    )
    const dataRanges = Constants.POWERUP_DATA_RANGES.get(type)!
    let data: number
    switch (type) {
      case Constants.POWERUP_TYPES.HEALTH_PACK:
        data = Util.randRangeInt(dataRanges.min, dataRanges.max + 1)
        break
      case Constants.POWERUP_TYPES.SHOTGUN:
        data = Util.randRangeInt(dataRanges.min, dataRanges.max + 1)
        break
      case Constants.POWERUP_TYPES.RAPIDFIRE:
        data = Util.randRange(dataRanges.min, dataRanges.max)
        break
      case Constants.POWERUP_TYPES.SPEEDBOOST:
        data = Util.randRange(dataRanges.min, dataRanges.max)
        break
      case Constants.POWERUP_TYPES.SHIELD:
        data = Util.randRangeInt(dataRanges.min, dataRanges.max + 1)
        break
      default:
        data = 0
    }
    const duration = Util.randRange(
      Constants.POWERUP_MIN_DURATION,
      Constants.POWERUP_MAX_DURATION,
    )
    return new Powerup(position, type, data, duration)
  }

  /**
   * Updates this Powerup's expiration time.
   */
  update(lastUpdateTime: number): void {
    this.expirationTime = lastUpdateTime + this.duration
  }
}

export default Powerup
