/**
 * Explosion is a short-lived entity with collision that deals damage. Even
 * though regular tank bullets have an explosion sprite when they expire, this
 * explosion is created by rockets only.
 *
 * @author omgimanerd
 */

import type { Ref } from 'lib/types'

import { Exclude } from 'class-transformer'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Entity from 'lib/game/entity/Entity'
import Player from 'lib/game/entity/Player'
import Vector from 'lib/math/Vector'
import GameServices from 'server/GameServices'

export default class Explosion extends Entity {
  static readonly DEFAULT_DAMAGE = 3
  static readonly HITBOX_SIZE = 20

  @Exclude() source: Ref<Player>

  damage: number
  duration: number
  expirationTime: number

  constructor(
    position: Vector,
    source: Player,
    damage: number,
    duration: number,
    expirationTime: number,
  ) {
    super(position, Vector.zero(), Vector.zero(), Explosion.HITBOX_SIZE)
    this.source = source
    this.damage = damage
    this.duration = duration
    this.expirationTime = expirationTime
  }

  static create(position: Vector, source: Player) {}

  override update(updateFrame: UpdateFrame, _services: GameServices): void {}
}
