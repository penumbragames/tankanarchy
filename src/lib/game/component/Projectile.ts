import Player from 'lib/game/entity/Player'

export default interface IProjectile {
  source: Player
  damage: number

  distanceTraveled: number
}
