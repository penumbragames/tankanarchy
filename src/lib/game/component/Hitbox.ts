/**
 * Component for entities or objects with circular hitboxes.
 * @author
 */

import { Exclude } from 'class-transformer'
import { Physics } from 'lib/game/component/Physics'
import Vector from 'lib/math/Vector'

export class Hitbox {
  @Exclude() body: Physics
  hitboxSize: number

  constructor(body: Physics, hitboxSize: number) {
    this.body = body
    this.hitboxSize = hitboxSize
  }

  collided(other: Hitbox) {
    const minDistance = this.hitboxSize + other.hitboxSize
    return (
      Vector.sub(this.body.position, other.body.position).mag2 <=
      minDistance * minDistance
    )
  }
}

export interface IHitbox {
  hitbox: Hitbox
}
