/**
 * This class stores global constants between the client and server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

module.exports = {
  WORLD_MIN: 0,
  WORLD_MAX: 5000,
  WORLD_PADDING: 30,

  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  SOCKET_UPDATE: 'update',
  SOCKET_NEW_PLAYER: 'new-player',
  SOCKET_PLAYER_ACTION: 'player-action',
  SOCKET_CHAT_CLIENT_SERVER: 'chat-client-to-server',
  SOCKET_CHAT_SERVER_CLIENT: 'chat-server-to-client',
  SOCKET_DISCONNECT: 'disconnect',

  PLAYER_TURN_RATE: 0.005,
  PLAYER_DEFAULT_SPEED: 300,
  PLAYER_SHOT_COOLDOWN: 800,
  PLAYER_DEFAULT_HITBOX_SIZE: 20,
  PLAYER_SHIELD_HITBOX_SIZE: 45,
  PLAYER_MAX_HEALTH: 10,

  BULLET_DEFAULT_DAMAGE: 1,
  BULLET_VELOCITY_MAGNITUDE: 850,
  BULLET_MAX_TRAVEL_DISTANCE: 1000 * 1000,
  BULLET_HITBOX_SIZE: 10,

  POWERUP_HITBOX_SIZE: 10,
  POWERUP_MAX_COUNT: 10,
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
