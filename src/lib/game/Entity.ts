/**
 * Wrapper class for all entities that need basic physics.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import { Type } from 'class-transformer'
import * as Constants from 'lib/Constants'
import Util from 'lib/math/Util'
import Vector from 'lib/math/Vector'

abstract class Entity {
  @Type(() => Vector) position: Vector
  @Type(() => Vector) velocity: Vector
  @Type(() => Vector) acceleration: Vector
  hitboxSize: number // Radial hitbox size
  destroyed: boolean

  constructor(
    position: Vector,
    velocity: Vector,
    acceleration: Vector,
    hitboxSize: number,
  ) {
    this.position = position
    this.velocity = velocity
    this.acceleration = acceleration
    this.hitboxSize = hitboxSize
    this.destroyed = false
  }

  update(_lastUpdateTime: number, _deltaTime: number): void {}

  /**
   * Returns true if this Entity's hitbox is overlapping or touching another
   * Entity's hitbox.
   */
  collided(other: Entity): boolean {
    const minDistance = this.hitboxSize + other.hitboxSize
    return (
      Vector.sub(this.position, other.position).mag2 <=
      minDistance * minDistance
    )
  }

  /**
   * Returns true if this Entity is inside the bounds of the game environment
   * world.
   */
  inWorld(): boolean {
    return (
      Util.inBound(this.position.x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(this.position.y, Constants.WORLD_MIN, Constants.WORLD_MAX)
    )
  }

  /**
   * Clamps this Entity's position within the game world if it is outside of the
   * game world.
   */
  boundToWorld(): void {
    this.position.x = Util.clamp(
      this.position.x,
      Constants.WORLD_MIN,
      Constants.WORLD_MAX,
    )
    this.position.y = Util.clamp(
      this.position.y,
      Constants.WORLD_MIN,
      Constants.WORLD_MAX,
    )
  }
}

export default Entity
