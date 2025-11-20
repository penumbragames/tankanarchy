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
import Player from 'lib/game/entity/player/Player'
import Vector from 'lib/math/Vector'
import { GameServices } from 'server/GameServices'

export default class Explosion extends Entity {
  static readonly DEFAULT_DAMAGE = 3
  // should be synced to explosion animation
  static readonly DEFAULT_DURATION = 450 // ms
  static readonly HITBOX_SIZE = 60

  @Exclude() source: Ref<Player>
  // tracks players we've already damaged
  @Exclude() damaged: Set<string> = new Set()

  damage: number = Explosion.DEFAULT_DAMAGE
  duration: number = Explosion.DEFAULT_DURATION
  expirationTime: number

  constructor(position: Vector, source: Player, currentTime: number) {
    super(position, Vector.zero(), Vector.zero(), Explosion.HITBOX_SIZE)
    this.source = source
    this.expirationTime = currentTime + this.duration
  }

  static create(position: Vector, source: Player, currentTime: number) {
    return new Explosion(position, source, currentTime)
  }

  override update(updateFrame: UpdateFrame, _services: GameServices) {
    this.destroyed = updateFrame.currentTime > this.expirationTime
  }

  tryDamage(player: Player): boolean {
    if (this.damaged.has(player.socketID)) {
      return false
    }
    this.damaged.add(player.socketID)
    return true
  }
}
