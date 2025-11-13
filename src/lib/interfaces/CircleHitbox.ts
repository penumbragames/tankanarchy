/**
 * @author omgimanerd
 */

import Vector from 'lib/math/Vector'

export default interface HasHitbox {
  position: Vector
  hitboxSize: number

  collided(other: HasHitbox): boolean
  onCollision(other: HasHitbox): void
}
