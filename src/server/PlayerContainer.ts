/**
 * Server side container for managing players and their corresponding sockets.
 * @author omgimanerd
 */

import Player from 'lib/game/entity/Player'
import { Socket, SocketServer } from 'lib/socket/SocketServer'

export default class PlayerContainer {
  socketServer: SocketServer

  // socket id to Socket
  sockets_: Map<string, Socket> = new Map()
  // socket id to Player
  players_: Map<string, Player> = new Map()

  constructor(socketServer: SocketServer) {
    this.socketServer = socketServer
  }

  get sockets(): MapIterator<Socket> {
    return this.sockets_.values()
  }

  get players(): MapIterator<Player> {
    return this.players_.values()
  }

  add(name: string, socket: Socket): void {
    this.sockets_.set(socket.id, socket)
    this.players_.set(socket.id, Player.create(name, socket.id))
  }

  getSocket(socketID: string): Socket | undefined {
    return this.sockets_.get(socketID)
  }

  getPlayer(socketID: string): Player | undefined {
    return this.players_.get(socketID)
  }

  /**
   * @param socketID The socket ID of the player to remove.
   * @returns {string} Returns the display name of the player.
   */
  remove(socketID: string): string {
    const player = this.players_.get(socketID)
    if (!player) return ''
    this.sockets_.delete(socketID)
    this.players_.delete(socketID)
    return player.name
  }

  getDisplayName(socketID: string): string {
    return this.players_.get(socketID)?.name ?? ''
  }
}
