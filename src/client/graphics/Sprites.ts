/**
 * Global store of sprite objects on the client side to be used for rendering.
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'
import POWERUPS from 'lib/enums/Powerups'
import SPRITES from 'lib/enums/Sprites'

import AnimatedSprite from 'client/graphics/AnimatedSprite'
import { Sprite } from 'client/graphics/Sprite'
import StaticSprite from 'client/graphics/StaticSprite'
import { StrictEnumMapping } from 'lib/enums/EnumMapping'

// Global sprite object stores, populated asynchronously
export let SPRITE_MAP: Record<SPRITES, Sprite> = {} as Record<SPRITES, Sprite>
export let POWERUP_SPRITES: Record<POWERUPS, Sprite> = {} as Record<
  POWERUPS,
  Sprite
>
export let PARTICLE_SPRITES: Record<PARTICLES, Sprite> = {} as Record<
  PARTICLES,
  Sprite
>

// All Sprite subclasses should have an async create method.
interface Creatable<T extends Sprite> {
  create: (src: string) => Promise<T>
}

const loadSprite = async <T extends Sprite>(
  sprite: SPRITES,
  constructor: Creatable<T>,
  src: string,
) => {
  SPRITE_MAP[sprite] = await constructor.create(src)
}

const loadSprites = async () => {
  await Promise.all([
    loadSprite(SPRITES.BULLET, StaticSprite, '/img/bullet.png'),
    // Animated sprite has 9 frames, should dynamically gen this.
    loadSprite(SPRITES.EXPLOSION, AnimatedSprite, '/img/explosion.png'),
    loadSprite(
      SPRITES.HEALTH_PACK_POWERUP,
      StaticSprite,
      '/img/health_pack_powerup.png',
    ),
    loadSprite(SPRITES.LASER_POWERUP, StaticSprite, '/img/laser_powerup.png'),
    loadSprite(SPRITES.OTHER_TANK, StaticSprite, '/img/other_tank.png'),
    loadSprite(SPRITES.OTHER_TURRET, StaticSprite, '/img/other_turret.png'),
    loadSprite(
      SPRITES.RAPIDFIRE_POWERUP,
      StaticSprite,
      '/img/rapidfire_powerup.png',
    ),
    loadSprite(SPRITES.ROCKET, StaticSprite, '/img/rocket.png'),
    loadSprite(SPRITES.ROCKET_POWERUP, StaticSprite, '/img/rocket_powerup.png'),
    loadSprite(SPRITES.SELF_TANK, StaticSprite, '/img/self_tank.png'),
    loadSprite(SPRITES.SELF_TURRET, StaticSprite, '/img/self_turret.png'),
    loadSprite(SPRITES.SHIELD, StaticSprite, '/img/shield.png'),
    loadSprite(SPRITES.SHIELD_POWERUP, StaticSprite, '/img/shield_powerup.png'),
    loadSprite(
      SPRITES.SHOTGUN_POWERUP,
      StaticSprite,
      '/img/shotgun_powerup.png',
    ),
    loadSprite(
      SPRITES.SPEEDBOOST_POWERUP,
      StaticSprite,
      '/img/speedboost_powerup.png',
    ),
    loadSprite(SPRITES.TANK_TRAIL, StaticSprite, '/img/tank_trail.png'),
    loadSprite(SPRITES.TILE, StaticSprite, '/img/tile.png'),
  ])

  const s = StrictEnumMapping<Sprite>(SPRITES, SPRITE_MAP)
  POWERUP_SPRITES = {
    [POWERUPS.HEALTH_PACK]: s[SPRITES.HEALTH_PACK_POWERUP],
    [POWERUPS.LASER]: s[SPRITES.LASER_POWERUP],
    [POWERUPS.RAPIDFIRE]: s[SPRITES.RAPIDFIRE_POWERUP],
    [POWERUPS.ROCKET]: s[SPRITES.ROCKET_POWERUP],
    [POWERUPS.SHIELD]: s[SPRITES.SHIELD_POWERUP],
    [POWERUPS.SHOTGUN]: s[SPRITES.SHOTGUN_POWERUP],
    [POWERUPS.SPEEDBOOST]: s[SPRITES.SPEEDBOOST_POWERUP],
  }
  PARTICLE_SPRITES = {
    [PARTICLES.EXPLOSION]: s[SPRITES.EXPLOSION],
  }
}
export default loadSprites
