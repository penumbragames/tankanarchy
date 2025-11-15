/**
 * Explosion is a short-lived entity with collision that deals damage. Even
 * though regular tank bullets have an explosion sprite when they expire, this
 * explosion is created by rockets only.
 *
 * @author omgimanerd
 */

import { Exclude } from 'class-transformer'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Entity from 'lib/game/entity/Entity'
import Player from 'lib/game/entity/Player'
import Vector from 'lib/math/Vector'

export default class Explosion extends Entity {
  static readonly DEFAULT_DAMAGE = 3
  static readonly HITBOX_SIZE = 20

  @Exclude() source: Player

  damage: number
  duration: number

  constructor(
    position: Vector,
    source: Player,
    damage: number,
    duration: number,
  ) {
    super(position, Vector.zero(), Vector.zero(), Explosion.HITBOX_SIZE)
    this.source = source
    this.damage = damage
    this.duration = duration
  }

  override update(updateFrame: UpdateFrame): void {}
}
