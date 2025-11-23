/**
 * Named enum for all events that can be sent over socket. Interfaces for each
 * event are defined in SocketInterfaces.ts
 * @author omgimanerd
 */

enum SOCKET_EVENTS {
  // Client to server, chat message
  CHAT_SEND = 'CHAT_SEND',
  // Server to client, broadcasts received chat messages
  CHAT_BROADCAST = 'CHAT_BROADCAST',
  // Debug command sent by client to trigger behavior for debugging
  DEBUG = 'DEBUG',
  // Client to server, sent automatically on socket disconnect
  DISCONNECT = 'disconnect', // BUILTIN SOCKET EVENT
  // Server to client, sends game state
  GAME_UPDATE = 'GAME_UPDATE',
  // Client to server, sent on new player join
  NEW_PLAYER = 'NEW_PLAYER',
  // Server to client, sent to trigger particle rendering
  PARTICLE = 'PARTICLE',
  // Client to server, sent on keyboard/mouse input
  PLAYER_ACTION = 'PLAYER_ACTION',
  // Server to client, sent to trigger sound playing
  SOUND = 'SOUND_EVENT',
}

export default SOCKET_EVENTS
