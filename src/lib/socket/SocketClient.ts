/**
 * Helpers for the client side sockets.
 */

import { io, Socket } from 'socket.io-client'

import SocketParser from 'lib/serialization/SocketParser'
import { ClientToServerEvents, ServerToClientEvents } from './SocketInterfaces'

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>

export const getSocketClient = (): SocketClient => {
  return io({ parser: SocketParser })
}
