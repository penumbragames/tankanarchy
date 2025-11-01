/**
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

export const PLAYER_TURN_RATE = 0.005
export const PLAYER_DEFAULT_SPEED = 0.4
export const PLAYER_SHOT_COOLDOWN = 800
export const PLAYER_DEFAULT_HITBOX_SIZE = 20
export const PLAYER_SHIELD_HITBOX_SIZE = 45
export const PLAYER_MAX_HEALTH = 10

export const BULLET_DEFAULT_DAMAGE = 1
export const BULLET_SPEED = 1.2
export const BULLET_MAX_TRAVEL_DISTANCE = 1000
export const BULLET_HITBOX_SIZE = 10

export const POWERUP_HITBOX_SIZE = 5
export const POWERUP_MAX_COUNT = 50
export const POWERUP_MIN_DURATION = 5000
export const POWERUP_MAX_DURATION = 15000
export enum POWERUP_TYPES {
  HEALTH_PACK = 'HEALTH_PACK',
  SHOTGUN = 'SHOTGUN',
  RAPIDFIRE = 'RAPIDFIRE',
  SPEEDBOOST = 'SPEEDBOOST',
  SHIELD = 'SHIELD',
}
export interface POWERUP_DATA {
  min: number
  max: number
}
export const POWERUP_DATA_RANGES = new Map<POWERUP_TYPES, POWERUP_DATA>([
  [POWERUP_TYPES.HEALTH_PACK, { min: 1, max: 4 }],
  [POWERUP_TYPES.SHOTGUN, { min: 1, max: 2 }],
  [POWERUP_TYPES.RAPIDFIRE, { min: 2, max: 4 }],
  [POWERUP_TYPES.SPEEDBOOST, { min: 1.2, max: 1.8 }],
  [POWERUP_TYPES.SHIELD, { min: 1, max: 4 }],
])

export const WORLD_MIN = 0
export const WORLD_MAX = 5000
export const WORLD_PADDING = 30
