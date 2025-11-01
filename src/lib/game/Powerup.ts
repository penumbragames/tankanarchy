/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from 'lib/Constants'
import Entity from 'lib/game/Entity'
import Util from 'lib/math/Util'
import Vector from 'lib/math/Vector'

export enum POWERUP_TYPES {
  HEALTH_PACK = 'HEALTH_PACK',
  SHOTGUN = 'SHOTGUN',
  RAPIDFIRE = 'RAPIDFIRE',
  SPEEDBOOST = 'SPEEDBOOST',
  SHIELD = 'SHIELD',
}

/**
 * Interface for data used to randomly generate Powerup modifier attributes.
 */
interface POWERUP_DATA {
  min: number
  max: number
}
type POWERUP_DATA_RANGES = {
  [key in POWERUP_TYPES]: POWERUP_DATA
}

export class Powerup extends Entity {
  static readonly HITBOX_SIZE = 5
  static readonly MAX_COUNT = 50
  static readonly MIN_DURATION = 5000
  static readonly MAX_DURATION = 15000
  static readonly DATA_RANGES: POWERUP_DATA_RANGES = {
    [POWERUP_TYPES.HEALTH_PACK]: { min: 1, max: 4 },
    [POWERUP_TYPES.SHOTGUN]: { min: 1, max: 2 },
    [POWERUP_TYPES.RAPIDFIRE]: { min: 2, max: 4 },
    [POWERUP_TYPES.SPEEDBOOST]: { min: 1.2, max: 1.8 },
    [POWERUP_TYPES.SHIELD]: { min: 1, max: 4 },
  }

  type: POWERUP_TYPES
  data: number
  duration: number
  expirationTime: number

  constructor(
    position: Vector,
    type: POWERUP_TYPES,
    data: number,
    duration: number,
  ) {
    super(position, Vector.zero(), Vector.zero(), Powerup.HITBOX_SIZE)

    this.type = type
    this.data = data
    this.duration = duration

    // This is set when the powerup is picked up by a player.
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
    const type = <POWERUP_TYPES>Util.choiceArray(Object.keys(POWERUP_TYPES))
    const dataRanges = Powerup.DATA_RANGES[type]
    let data: number
    switch (type) {
      case POWERUP_TYPES.HEALTH_PACK:
        data = Util.randRangeInt(dataRanges.min, dataRanges.max + 1)
        break
      case POWERUP_TYPES.SHOTGUN:
        data = Util.randRangeInt(dataRanges.min, dataRanges.max + 1)
        break
      case POWERUP_TYPES.RAPIDFIRE:
        data = Util.randRange(dataRanges.min, dataRanges.max)
        break
      case POWERUP_TYPES.SPEEDBOOST:
        data = Util.randRange(dataRanges.min, dataRanges.max)
        break
      case POWERUP_TYPES.SHIELD:
        data = Util.randRangeInt(dataRanges.min, dataRanges.max + 1)
        break
      default:
        data = 0
    }
    const duration = Util.randRange(Powerup.MIN_DURATION, Powerup.MAX_DURATION)
    return new Powerup(position, type, data, duration)
  }

  update(lastUpdateTime: number): void {
    // Empty update stub.
  }

  get remainingMs() {
    return this.expirationTime - Date.now()
  }

  get remainingSeconds() {
    return this.remainingMs / 1000
  }
}
