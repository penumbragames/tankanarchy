/**
 * Interfaces for defined socket messages.
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'
import SOUNDS from 'lib/enums/Sounds'
import Bullet from 'lib/game/entity/Bullet'
import Player from 'lib/game/entity/Player'
import Powerup from 'lib/game/entity/Powerup'
import Vector from 'lib/math/Vector'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

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
  shootBullet: boolean
  shootRocket: boolean
}

/**
 * Server to client CHAT_SERVER_TO_CLIENT event to broadcast chat message to
 * all players.
 */
export interface ChatMessage {
  name: string
  message: string
  isNotification: boolean
}

/**
 * Server to client GAME_UPDATE event which contains the game state.
 */
export interface GameState {
  self: Player
  players: Player[]
  projectiles: Bullet[]
  powerups: Powerup[]
}

/**
 * Server to client PARTICLE event which triggers the client to render a
 * particle effect.
 */
export interface ParticleEvent {
  type: PARTICLES
  source: Vector
}

/**
 * Server to client SOUND event which triggers a sound to play.
 */
export interface SoundEvent {
  type: SOUNDS
  source: Vector
}

// Interfaces used to define the client and server socket objects.
// https://socket.io/docs/v4/typescript/
export interface ServerToClientEvents {
  [SOCKET_EVENTS.CHAT_BROADCAST]: (data: ChatMessage) => void
  [SOCKET_EVENTS.GAME_UPDATE]: (state: GameState) => void
  [SOCKET_EVENTS.PARTICLE]: (particle: ParticleEvent) => void
  [SOCKET_EVENTS.SOUND]: (event: SoundEvent) => void
}
export interface ClientToServerEvents {
  // Callback for this event is only used for acknowledgement, starting the game
  // on the client side.
  [SOCKET_EVENTS.NEW_PLAYER]: (name: string, callback: () => void) => void
  [SOCKET_EVENTS.PLAYER_ACTION]: (data: PlayerInputs) => void
  [SOCKET_EVENTS.CHAT_SEND]: (data: string) => void
  [SOCKET_EVENTS.DISCONNECT]: () => void
}
export interface InterServerEvents {}
export interface SocketData {}
