/**
 * Component for entities or objects with circular hitboxes. Entities with
 * circular hitboxes should implement IHitbox.
 * @author omgimanerd
 */

import { Exclude } from 'class-transformer'

import { Physics } from 'lib/game/component/Physics'
import Vector from 'lib/math/Vector'

export class Hitbox {
  @Exclude() body: Physics
  size: number

  constructor(body: Physics, size: number) {
    this.body = body
    this.size = size
  }

  collided(other: Hitbox) {
    const minDistance = this.size + other.size
    return (
      Vector.sub(this.body.position, other.body.position).mag2 <=
      minDistance * minDistance
    )
  }
}

export interface IHitbox {
  hitbox: Hitbox
}
