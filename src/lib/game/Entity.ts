/**
 * An entity is an object in the game with physics and a hitbox.
 * @author omgimanerd
 */

import PhysObject from 'lib/game/PhysObject'
import HasHitbox from 'lib/interfaces/CircleHitbox'
import Vector from 'lib/math/Vector'

export default class Entity extends PhysObject implements HasHitbox {
  hitboxSize: number

  constructor(
    position: Vector,
    velocity: Vector,
    acceleration: Vector,
    hitboxSize: number,
  ) {
    super(position, velocity, acceleration)
    this.hitboxSize = hitboxSize
  }

  /**
   * Returns true if this Entity's hitbox is overlapping or touching another
   * Entity's hitbox.
   */
  collided(other: HasHitbox): boolean {
    const minDistance = this.hitboxSize + other.hitboxSize
    return (
      Vector.sub(this.position, other.position).mag2 <=
      minDistance * minDistance
    )
  }

  onCollision(_other: HasHitbox): void {
    throw new Error('Not implemented!')
  }
}
