/**
 * A class encapsulating the state of a powerup on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from 'lib/Constants'
import POWERUPS from 'lib/enums/Powerups'
import Entity from 'lib/game/Entity'
import { PowerupConstructors, PowerupState } from 'lib/game/PowerupState'
import Util from 'lib/math/Util'
import Vector from 'lib/math/Vector'

export class Powerup extends Entity {
  static readonly HITBOX_SIZE = 5
  static readonly MAX_COUNT = 50

  type: POWERUPS

  constructor(position: Vector, type: POWERUPS) {
    super(position, Vector.zero(), Vector.zero(), Powerup.HITBOX_SIZE)

    this.type = type
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
    const type = <POWERUPS>Util.choiceArray(Object.keys(POWERUPS))
    return new Powerup(position, type)
  }

  get powerupState(): PowerupState {
    return new PowerupConstructors[this.type]().init()
  }
}
