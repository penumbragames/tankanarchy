/**
 * This class stores global constants between the client and server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

module.exports = {
  WORLD_MIN: 0,
  WORLD_MAX: 5000,
  WORLD_PADDING: 30,

  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  DRAWING_NAME_FONT: '14px Helvetica',
  DRAWING_NAME_COLOR: 'black',
  DRAWING_HP_COLOR: 'green',
  DRAWING_HP_MISSING_COLOR: 'red',
  DRAWING_IMG_BASE_PATH: '/client/img',
  DRAWING_IMG_SELF_TANK: 'self_tank',
  DRAWING_IMG_SELF_TURRET: 'self_turret',
  DRAWING_IMG_OTHER_TANK: 'other_tank',
  DRAWING_IMG_OTHER_TURRET: 'other_turret',
  DRAWING_IMG_SHIELD: 'shield',
  DRAWING_IMG_BULLET: 'bullet',
  DRAWING_IMG_TILE: 'tile',
  DRAWING_IMG_KEYS: [
    'self_tank', 'self_turret', 'other_tank', 'other_turret', 'shield',
    'bullet', 'tile'
  ],
  DRAWING_TILE_SIZE: 100,

  VIEWPORT_STICKINESS: 0.004,

  SOCKET_UPDATE: 'update',
  SOCKET_NEW_PLAYER: 'new-player',
  SOCKET_PLAYER_ACTION: 'player-action',
  SOCKET_CHAT_CLIENT_SERVER: 'chat-client-to-server',
  SOCKET_CHAT_SERVER_CLIENT: 'chat-server-to-client',
  SOCKET_DISCONNECT: 'disconnect',

  PLAYER_TURN_RATE: 0.005,
  PLAYER_DEFAULT_SPEED: 0.4,
  PLAYER_SHOT_COOLDOWN: 800,
  PLAYER_DEFAULT_HITBOX_SIZE: 20,
  PLAYER_SHIELD_HITBOX_SIZE: 45,
  PLAYER_MAX_HEALTH: 10,

  BULLET_DEFAULT_DAMAGE: 1,
  BULLET_SPEED: 1.2,
  BULLET_MAX_TRAVEL_DISTANCE_SQ: 1000 * 1000,
  BULLET_HITBOX_SIZE: 10,

  POWERUP_HITBOX_SIZE: 5,
  POWERUP_MAX_COUNT: 50,
  POWERUP_MIN_DURATION: 5000,
  POWERUP_MAX_DURATION: 15000,
  POWERUP_HEALTHPACK: 'healthpack',
  POWERUP_SHOTGUN: 'shotgun',
  POWERUP_RAPIDFIRE: 'rapidfire',
  POWERUP_SPEEDBOOST: 'speedboost',
  POWERUP_SHIELD: 'shield',
  POWERUP_KEYS: [
    'healthpack',
    'shotgun',
    'rapidfire',
    'speedboost',
    'shield'
  ],
  POWERUP_DATA: {
    healthpack: { MIN: 1, MAX: 4 },
    shotgun: { MIN: 1, MAX: 2 },
    rapidfire: { MIN: 2, MAX: 4 },
    speedboost: { MIN: 1.2, MAX: 1.8 },
    shield: { MIN: 1, MAX: 4 }
  }
}
