/**
 * Named enum for all events that can be sent over socket. Interfaces for each
 * event are defined in SocketInterfaces.ts
 * @author omgimanerd
 */

enum SOCKET_EVENTS {
  GAME_UPDATE = 'update',
  NEW_PLAYER = 'newPlayer',
  PLAYER_ACTION = 'playerAction',
  CHAT_CLIENT_TO_SERVER = 'chatClientToServer',
  CHAT_SERVER_TO_CLIENT = 'chatServerToClient',
  SOUND = 'soundEvent',
  DISCONNECT = 'disconnect',
}

export default SOCKET_EVENTS
