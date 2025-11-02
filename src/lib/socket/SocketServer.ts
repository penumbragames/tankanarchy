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

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

export type Socket = Socket_<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>

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
