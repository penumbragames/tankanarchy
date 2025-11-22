/**
 * Helpers for the socket server.
 * @author omgimanerd
 */

import http from 'http'
import SocketParser from 'lib/serialization/SocketParser'
import { Server, Socket as Socket_ } from 'socket.io'
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './SocketInterfaces'

// Socket server type
export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

// Client side socket type
export type Socket = Socket_<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

// Helper to get an initialized socket server from parent httpServer with the
// correct event interfaces.
export const getSocketServer = (httpServer: http.Server): SocketServer => {
  return new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    parser: SocketParser,
  })
}
