/**
 * Interfaces used in the code.
 * @author omgimanerd
 */

import Bullet from 'server/Bullet'
import Player from 'server/Player'
import Powerup from 'server/Powerup'

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
  projectiles: Bullet[]
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
export interface SERVER_TO_SERVER_EVENTS {}
export interface SOCKET_DATA {}
