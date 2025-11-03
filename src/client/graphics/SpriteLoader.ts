/**
 * Sprite loader class to handle asynchronous preloading all the sprites.
 */

import AnimatedSprite from 'client/graphics/AnimatedSprite'
import { Sprite } from 'client/graphics/Sprite'
import StaticSprite from 'client/graphics/StaticSprite'
import PARTICLES from 'lib/enums/Particles'
import SPRITES from 'lib/enums/Sprites'
import { POWERUP_TYPES } from 'lib/game/Powerup'

export type SpriteMap = { [key in SPRITES]: Sprite }
export type PowerupSprites = { [key in POWERUP_TYPES]: Sprite }
export type ParticleSprites = { [key in PARTICLES]: Sprite }

export class SpriteLoader {
  static sprites: SpriteMap
  static powerupSprites: PowerupSprites
  static particleSprites: ParticleSprites

  static async loadAssets() {
    // TODO: fire off all these promises in parallel
    SpriteLoader.sprites = {
      [SPRITES.BULLET]: await StaticSprite.create('/img/bullet.png'),
      [SPRITES.EXPLOSION]: await AnimatedSprite.create('/img/explosion.png'),
      [SPRITES.HEALTH_PACK_POWERUP]: await StaticSprite.create(
        '/img/health_pack_powerup.png',
      ),
      [SPRITES.OTHER_TANK]: await StaticSprite.create('/img/other_tank.png'),
      [SPRITES.OTHER_TURRET]: await StaticSprite.create(
        '/img/other_turret.png',
      ),
      [SPRITES.RAPIDFIRE_POWERUP]: await StaticSprite.create(
        '/img/rapidfire_powerup.png',
      ),
      [SPRITES.SELF_TANK]: await StaticSprite.create('/img/self_tank.png'),
      [SPRITES.SELF_TURRET]: await StaticSprite.create('/img/self_turret.png'),
      [SPRITES.SHIELD]: await StaticSprite.create('/img/shield.png'),
      [SPRITES.SHIELD_POWERUP]: await StaticSprite.create(
        '/img/shield_powerup.png',
      ),
      [SPRITES.SHOTGUN_POWERUP]: await StaticSprite.create(
        '/img/shotgun_powerup.png',
      ),
      [SPRITES.SPEEDBOOST_POWERUP]: await StaticSprite.create(
        '/img/speedboost_powerup.png',
      ),
      [SPRITES.TILE]: await StaticSprite.create('/img/tile.png'),
    }

    const s = SpriteLoader.sprites
    SpriteLoader.powerupSprites = {
      [POWERUP_TYPES.HEALTH_PACK]: s[SPRITES.HEALTH_PACK_POWERUP],
      [POWERUP_TYPES.RAPIDFIRE]: s[SPRITES.RAPIDFIRE_POWERUP],
      [POWERUP_TYPES.SHIELD]: s[SPRITES.SHIELD_POWERUP],
      [POWERUP_TYPES.SHOTGUN]: s[SPRITES.SHOTGUN_POWERUP],
      [POWERUP_TYPES.SPEEDBOOST]: s[SPRITES.SPEEDBOOST_POWERUP],
    }
    SpriteLoader.particleSprites = {
      [PARTICLES.EXPLOSION]: s[SPRITES.EXPLOSION],
    }
  }
}
