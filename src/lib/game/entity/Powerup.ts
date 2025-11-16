/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import POWERUPS from 'lib/enums/Powerups'

import * as Constants from 'lib/Constants'
import Entity from 'lib/game/entity/Entity'
import { PowerupConstructors, PowerupState } from 'lib/game/entity/PowerupState'
import Random from 'lib/math/Random'
import Vector from 'lib/math/Vector'

export default class Powerup extends Entity {
  static readonly HITBOX_SIZE = 10
  static readonly MAX_COUNT = 50

  type: POWERUPS

  constructor(position: Vector, type: POWERUPS) {
    super(position, Vector.zero(), Vector.zero(), Powerup.HITBOX_SIZE)

    this.type = type
  }

  static create(): Powerup {
    const position = new Vector(
      Random.randRange(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
      Random.randRange(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
    )
    const type = <POWERUPS>Random.choiceArray(Object.keys(POWERUPS))
    return new Powerup(position, type)
  }

  get powerupState(): PowerupState {
    return new PowerupConstructors[this.type]().init()
  }
}
