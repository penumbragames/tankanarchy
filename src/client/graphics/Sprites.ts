/**
 * Global store of sprite objects on the client side to be reused for
 * rendering.
 */

import { Sprite } from 'client/graphics/Sprite'
import { POWERUP_TYPES } from 'lib/Constants'

export const BULLET = Sprite.create('/img/bullet.png')
export const HEALTH_PACK_POWERUP = Sprite.create('/img/health_pack_powerup.png')
export const HEATSEEKER = Sprite.create('/img/heatseeker.png')
export const OTHER_TANK = Sprite.create('/img/other_tank.png')
export const OTHER_TURRET = Sprite.create('/img/other_turret.png')
export const RAPIDFIRE_POWERUP = Sprite.create('/img/rapidfire_powerup.png')
export const SELF_TANK = Sprite.create('/img/self_tank.png')
export const SELF_TURRET = Sprite.create('/img/self_turret.png')
export const SHIELD_POWERUP = Sprite.create('/img/shield_powerup.png')
export const SHIELD = Sprite.create('/img/shield.png')
export const SHOTGUN_POWERUP = Sprite.create('/img/shotgun_powerup.png')
export const SPEEDBOOST_POWERUP = Sprite.create('/img/speedboost_powerup.png')
export const TILE = Sprite.create('/img/tile.png')

type POWERUP_SPRITE_MAP_TYPE = {
  [key: string]: Sprite
}

export const POWERUP_SPRITE_MAP: POWERUP_SPRITE_MAP_TYPE = {
  [POWERUP_TYPES.HEALTH_PACK]: HEALTH_PACK_POWERUP,
  [POWERUP_TYPES.RAPIDFIRE]: RAPIDFIRE_POWERUP,
  [POWERUP_TYPES.SHOTGUN]: SHOTGUN_POWERUP,
  [POWERUP_TYPES.SHIELD]: SHIELD_POWERUP,
  [POWERUP_TYPES.SPEEDBOOST]: SPEEDBOOST_POWERUP,
}
