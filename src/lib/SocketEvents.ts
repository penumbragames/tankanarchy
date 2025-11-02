/**
 * Interfaces used in the code.
 * @author omgimanerd
 */

import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import { Powerup } from 'lib/game/Powerup'

// Socket events we can listen for.
export enum SOCKET_EVENTS {
  UPDATE = 'update',
  NEW_PLAYER = 'newPlayer',
  PLAYER_ACTION = 'playerAction',
  CHAT_CLIENT_SERVER = 'chatClientToServer',
  CHAT_SERVER_CLIENT = 'chatServerToClient',
  SOUND_EVENT = 'soundEvent',
  DISCONNECT = 'disconnect',
}

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
export interface ServerToClientEvents {
  [SOCKET_EVENTS.UPDATE]: (state: GAME_STATE) => void
  [SOCKET_EVENTS.CHAT_SERVER_CLIENT]: (data: CHAT_MESSAGE) => void
}
export interface ClientToServerEvents {
  [SOCKET_EVENTS.NEW_PLAYER]: (name: string, callback: () => void) => void
  [SOCKET_EVENTS.PLAYER_ACTION]: (data: PLAYER_INPUTS) => void
  [SOCKET_EVENTS.CHAT_CLIENT_SERVER]: (data: CHAT_MESSAGE) => void
  [SOCKET_EVENTS.DISCONNECT]: () => void
}
export interface InterServerEvents {}
export interface SocketData {}
