/**
 * Interfaces for defined socket messages.
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'
import POWERUPS from 'lib/enums/Powerups'
import SOUNDS from 'lib/enums/Sounds'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import Entity from 'lib/game/entity/Entity'
import Player from 'lib/game/entity/player/Player'
import Vector from 'lib/math/Vector'
import { ParticleDrawingOptions } from 'server/GameServices'

// Server to client CHAT_SERVER_TO_CLIENT event to broadcast chat message to all
// players.
export interface ChatMessage {
  name: string
  message: string
  isNotification: boolean
}

export interface DebugCommand {
  socketId: string
  applyPowerup?: POWERUPS
}

// Server to client GAME_UPDATE event which contains the game state.
export interface GameState {
  self: Player
  players: Player[]
  entities: Entity[]
}

// Server to client PARTICLE event which triggers the client to render a
// particle effect.
export interface ParticleEvent {
  type: PARTICLES
  source: Vector
  options?: Partial<ParticleDrawingOptions>
}

// Client to server PLAYER_ACTION event, communicate a player's input state.
export interface PlayerInputs {
  up: boolean
  down: boolean
  right: boolean
  left: boolean
  worldMouseCoords: Vector
  turretAngle: number
  mouseLeft: boolean
  mouseRight: boolean
}

// Server to client SOUND event which triggers sound actions on the client.
export interface SoundEvent {
  action?: SoundEvent.ACTION
  id?: string
  type: SOUNDS
  source: Vector
}
export namespace SoundEvent {
  export enum ACTION {
    PLAY = 'PLAY',
    LOOP = 'LOOP',
    PAUSE = 'PAUSE',
    STOP = 'STOP',
    MOVE = 'MOVE',
  }
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
  [SOCKET_EVENTS.CHAT_SEND]: (data: string) => void
  [SOCKET_EVENTS.DEBUG]: (data: DebugCommand) => void
  [SOCKET_EVENTS.DISCONNECT]: () => void
  // Callback for this event is only used for acknowledgement, starting the game
  // on the client side.
  [SOCKET_EVENTS.NEW_PLAYER]: (name: string, callback: () => void) => void
  [SOCKET_EVENTS.PLAYER_ACTION]: (data: PlayerInputs) => void
}
export interface InterServerEvents {}
export interface SocketData {}
