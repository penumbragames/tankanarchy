/**
 * This class stores global constants between the client and server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Entity from './Entity'
import Player from '../server/Player'
import Powerup from '../server/Powerup'

// Socket events we can listen for.
export enum SOCKET {
  UPDATE = 'update',
  NEW_PLAYER = 'newPlayer',
  PLAYER_ACTION = 'playerAction',
  CHAT_CLIENT_SERVER = 'chatClientToServer',
  CHAT_SERVER_CLIENT = 'chatServerToClient',
  DISCONNECT = 'disconnect',
}
// Interfaces for objects that can be sent via socket
export interface PLAYER_INPUTS {
  up: boolean
  down: boolean
  right: boolean
  left: boolean
  turretAngle: number
  shoot: boolean
}
export interface CHAT_MESSAGE {
  name: string
  message: string
  isNotification: boolean
}
export interface GAME_STATE {
  self: Player
  players: Player[]
  projectiles: Entity[]
  powerups: Powerup[]
}

// Interfaces for each of the socket.io communication types
export interface SERVER_TO_CLIENT_EVENTS {
  [SOCKET.UPDATE]: (state: GAME_STATE) => void
  [SOCKET.CHAT_SERVER_CLIENT]: (data: CHAT_MESSAGE) => void
}
export interface CLIENT_TO_SERVER_EVENTS {
  [SOCKET.NEW_PLAYER]: (name: string, callback: () => void) => void
  [SOCKET.PLAYER_ACTION]: (data: PLAYER_INPUTS) => void
  [SOCKET.CHAT_CLIENT_SERVER]: (data: CHAT_MESSAGE) => void
  [SOCKET.DISCONNECT]: () => void
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SERVER_TO_SERVER_EVENTS {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SOCKET_DATA {}

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
// This enum cannot share any values with DRAWING_IMG_KEYS below since they will
// both be used to key a map to the image asset paths.
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

export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const DRAWING_NAME_FONT = '14px Helvetica'
export const DRAWING_NAME_COLOR = 'black'
export const DRAWING_HP_COLOR = 'red'
export const DRAWING_HP_MISSING_COLOR = 'grey'
export const DRAWING_IMG_BASE_PATH = '/img'
// This enum cannot share any values with POWERUP_TYPES above since they will
// both be used to key a map to the image asset paths.
export enum DRAWING_IMG_KEYS {
  SELF_TANK = 'SELF_TANK',
  SELF_TURRET = 'SELF_TURRET',
  OTHER_TANK = 'OTHER_TANK',
  OTHER_TURRET = 'OTHER_TURRET',
  PLAYER_SHIELD = 'PLAYER_SHIELD',
  BULLET = 'BULLET',
  TILE = 'TILE',
}
export const DRAWING_IMG_KEY_TO_ASSET = new Map<
  DRAWING_IMG_KEYS | POWERUP_TYPES,
  string
>([
  [DRAWING_IMG_KEYS.SELF_TANK, 'self_tank.png'],
  [DRAWING_IMG_KEYS.SELF_TURRET, 'self_turret.png'],
  [DRAWING_IMG_KEYS.OTHER_TANK, 'other_tank.png'],
  [DRAWING_IMG_KEYS.OTHER_TURRET, 'other_turret.png'],
  [DRAWING_IMG_KEYS.PLAYER_SHIELD, 'shield.png'],
  [DRAWING_IMG_KEYS.BULLET, 'bullet.png'],
  [DRAWING_IMG_KEYS.TILE, 'tile.png'],
  [POWERUP_TYPES.HEALTH_PACK, 'health_pack_powerup.png'],
  [POWERUP_TYPES.RAPIDFIRE, 'rapidfire_powerup.png'],
  [POWERUP_TYPES.SHIELD, 'shield_powerup.png'],
  [POWERUP_TYPES.SHOTGUN, 'shotgun_powerup.png'],
  [POWERUP_TYPES.SPEEDBOOST, 'speedboost_powerup.png'],
])
export const DRAWING_TILE_SIZE = 100
export const VIEWPORT_STICKINESS = 0.004

// Validation code in anonymous function, module will break on import if invalid
;((): void => {
  const m = new Set(Object.keys(DRAWING_IMG_KEYS))
  for (const v in POWERUP_TYPES) {
    if (m.has(v)) {
      throw new Error(
        'Keys in POWERUP_TYPES cannot intersect with DRAWING_IMG_KEYS',
      )
    }
  }
})()
