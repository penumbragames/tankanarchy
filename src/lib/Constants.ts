/**
 * This class stores global constants between the client and server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

export const WORLD_MIN = 0
export const WORLD_MAX = 5000
export const WORLD_PADDING = 30

export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const DRAWING_NAME_FONT = '14px Helvetica'
export const DRAWING_NAME_COLOR = 'black'
export const DRAWING_HP_COLOR = 'green'
export const DRAWING_HP_MISSING_COLOR = 'red'
export const DRAWING_IMG_BASE_PATH = '/client/img'

// export DRAWING_IMG_SELF_TANK = 'self_tank'
// export DRAWING_IMG_SELF_TURRET = 'self_turret'
// export DRAWING_IMG_OTHER_TANK = 'other_tank'
// export DRAWING_IMG_OTHER_TURRET = 'other_turret'
// export DRAWING_IMG_SHIELD = 'shield'
// export DRAWING_IMG_BULLET = 'bullet'
// export DRAWING_IMG_TILE = 'tile'
export enum DRAWING_IMG_KEYS {
  SELF_TANK = 'self_tank',
  SELF_TURRET = 'self_turret',
  OTHER_TANK = 'other_tank',
  OTHER_TURRET = 'other_turret',
  SHIELD = 'shield',
  BULLET = 'bullet',
  TILE = 'tile',
}

export const DRAWING_TILE_SIZE = 100
export const VIEWPORT_STICKINESS = 0.004

export enum SOCKET {
  UPDATE = 'update',
  NEW_PLAYER = 'new-player',
  PLAYER_ACTION = 'player-action',
  CHAT_CLIENT_SERVER = 'chat-client-to-server',
  CHAT_SERVER_CLIENT = 'chat-server-to-client',
  DISCONNECT = 'disconnect',
}

export const PLAYER_TURN_RATE = 0.005
export const PLAYER_DEFAULT_SPEED = 0.4
export const PLAYER_SHOT_COOLDOWN = 800
export const PLAYER_DEFAULT_HITBOX_SIZE = 20
export const PLAYER_SHIELD_HITBOX_SIZE = 45
export const PLAYER_MAX_HEALTH = 10
export interface PLAYER_INPUTS {
  up: boolean,
  down: boolean,
  right: boolean,
  left: boolean,
  turretAngle: number,
}

export const BULLET_DEFAULT_DAMAGE = 1
export const BULLET_SPEED = 1.2
export const BULLET_MAX_TRAVEL_DISTANCE_SQ = 1000 * 1000
export const BULLET_HITBOX_SIZE = 10

export const POWERUP_HITBOX_SIZE = 5
export const POWERUP_MAX_COUNT = 50
export const POWERUP_MIN_DURATION = 5000
export const POWERUP_MAX_DURATION = 15000
export enum POWERUP_TYPES {
  HEALTH_PACK = "health_pack",
  SHOTGUN = 'shotgun',
  RAPIDFIRE = 'rapidfire',
  SPEEDBOOST = 'speedboost',
  SHIELD = 'shield',
}

export interface POWERUP_DATA {
  min: number,
  max: number,
}
export const POWERUP_DATA_RANGES = new Map<POWERUP_TYPES, POWERUP_DATA>([
  [POWERUP_TYPES.HEALTH_PACK, { min: 1, max: 4 }],
  [POWERUP_TYPES.SHOTGUN, { min: 1, max: 2 }],
  [POWERUP_TYPES.RAPIDFIRE, { min: 2, max: 4 }],
  [POWERUP_TYPES.SPEEDBOOST, { min: 1.2, max: 1.8 }],
  [POWERUP_TYPES.SHIELD, { min: 1, max: 4 }],
])
