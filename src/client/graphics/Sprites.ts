/**
 * Global store of sprite objects on the client side to be reused for
 * rendering.
 */

import AnimatedSprite from 'client/graphics/AnimatedSprite'
import StaticSprite from 'client/graphics/StaticSprite'
import { POWERUP_TYPES } from 'lib/game/Powerup'
import { StrictEnumMapping } from 'lib/util/Enum'

export const BULLET = StaticSprite.create('/img/bullet.png')
export const EXPLOSION = AnimatedSprite.create('/img/explosion.png')
export const HEALTH_PACK_POWERUP = StaticSprite.create(
  '/img/health_pack_powerup.png',
)
export const OTHER_TANK = StaticSprite.create('/img/other_tank.png')
export const OTHER_TURRET = StaticSprite.create('/img/other_turret.png')
export const RAPIDFIRE_POWERUP = StaticSprite.create(
  '/img/rapidfire_powerup.png',
)
export const SELF_TANK = StaticSprite.create('/img/self_tank.png')
export const SELF_TURRET = StaticSprite.create('/img/self_turret.png')
export const SHIELD = StaticSprite.create('/img/shield.png')
export const SHIELD_POWERUP = StaticSprite.create('/img/shield_powerup.png')
export const SHOTGUN_POWERUP = StaticSprite.create('/img/shotgun_powerup.png')
export const SPEEDBOOST_POWERUP = StaticSprite.create(
  '/img/speedboost_powerup.png',
)
export const TILE = StaticSprite.create('/img/tile.png')

export const POWERUP_SPRITE_MAP = StrictEnumMapping<StaticSprite>(
  POWERUP_TYPES,
  {
    [POWERUP_TYPES.HEALTH_PACK]: HEALTH_PACK_POWERUP,
    [POWERUP_TYPES.RAPIDFIRE]: RAPIDFIRE_POWERUP,
    [POWERUP_TYPES.SHOTGUN]: SHOTGUN_POWERUP,
    [POWERUP_TYPES.SHIELD]: SHIELD_POWERUP,
    [POWERUP_TYPES.SPEEDBOOST]: SPEEDBOOST_POWERUP,
  },
)
