/**
 * @author omgimanerd
 */

import Entity from 'lib/game/entity/Entity'
import Player from 'lib/game/entity/Player'

export interface IProjectile {
  angle: number

  source: Player
  damage: number

  distanceTraveled: number
}

export type Projectile = Entity & IProjectile
