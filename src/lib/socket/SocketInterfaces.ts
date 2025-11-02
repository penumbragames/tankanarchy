/**
 * Interfaces for defined socket messages.
 * @author omgimanerd
 */

import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import { Powerup } from 'lib/game/Powerup'
import Vector from 'lib/math/Vector'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'
import SOUNDS from 'lib/sound/Sounds'

/**
 * Interface for the PLAYER_ACTION socket event, sent from the client to the
 * server to communicate a player's input state.
 */
export interface PlayerInputs {
  up: boolean
  down: boolean
  right: boolean
  left: boolean
  turretAngle: number
  shoot: boolean
}

/**
 * Interface for the CHAT_SERVER_TO_CLIENT and CHAT_CLIENT_TO_SERVER socket
 * events, sent by the client to the server for a chat message, and then
 * broadcast back from the server to all connected clients.
 */
export interface ChatMessage {
  name: string
  message: string
  isNotification: boolean
}

/**
 * Interface for the UPDATE socket event, broadcast by the server to send the
 * current game state to all clients.
 */
export interface GameState {
  self: Player
  players: Player[]
  projectiles: Bullet[]
  powerups: Powerup[]
}

/**
 * Interface for the SOUND socket event, broadcast by the server to indicate a
 * sound being played at a location.
 */
export interface SoundEvent {
  type: SOUNDS
  source: Vector
}

// Interfaces used to define the client and server socket objects.
// https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  [SOCKET_EVENTS.CHAT_SERVER_TO_CLIENT]: (data: ChatMessage) => void
  [SOCKET_EVENTS.GAME_UPDATE]: (state: GameState) => void
  [SOCKET_EVENTS.SOUND]: (event: SoundEvent) => void
}
export interface ClientToServerEvents {
  // Callback for this event is only used for acknowledgement, starting the game
  // on the client side.
  [SOCKET_EVENTS.NEW_PLAYER]: (name: string, callback: () => void) => void
  [SOCKET_EVENTS.PLAYER_ACTION]: (data: PlayerInputs) => void
  [SOCKET_EVENTS.CHAT_CLIENT_TO_SERVER]: (data: ChatMessage) => void
  [SOCKET_EVENTS.DISCONNECT]: () => void
}
export interface InterServerEvents {}
export interface SocketData {}
