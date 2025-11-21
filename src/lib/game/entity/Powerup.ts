/**
 * A class encapsulating a powerup entity that can be picked up.
 * @author omgimanerd
 */

import random from 'random'

import POWERUPS from 'lib/enums/Powerups'

import * as Constants from 'lib/Constants'
import Entity from 'lib/game/entity/Entity'
import {
  PowerupConstructors,
  PowerupState,
} from 'lib/game/entity/player/PowerupState'
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
      random.int(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
      random.int(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
    )
    const type = <POWERUPS>random.choice(Object.keys(POWERUPS))
    return new Powerup(position, type)
  }

  get powerupState(): PowerupState {
    return new PowerupConstructors[this.type]().init()
  }
}
