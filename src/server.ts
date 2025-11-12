/**
 * This is the server app script that is run on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import 'reflect-metadata'

import express from 'express'
import http from 'http'
import morgan from 'morgan'
import path from 'node:path'

import { Socket } from 'socket.io'

import { CHAT_TAG } from 'lib/Constants'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import { PlayerInputs } from 'lib/socket/SocketInterfaces'
import { getSocketServer } from 'lib/socket/SocketServer'
import Game from 'server/Game'

const PORT = process.env.PORT || 5000
const DIRNAME = import.meta.dirname

const app: express.Application = express()
const httpServer = http.createServer(app)
const socketServer = getSocketServer(httpServer)
const game = new Game(socketServer)

app.set('port', PORT)

app.use(morgan('dev'))
app.use(express.static(DIRNAME))

// Routing
app.get('/', (_, res) => {
  res.sendFile(path.join(DIRNAME, '../html/index.html'))
})
app.use('/dist', express.static(path.join(DIRNAME, '../dist')))
app.use('/img/', express.static(path.join(DIRNAME, '../img/')))
app.use('/sound', express.static(path.join(DIRNAME, '../sound/')))

socketServer.on('connection', (socket: Socket) => {
  socket.on(SOCKET_EVENTS.NEW_PLAYER, (name: string, callback: () => void) => {
    game.players.add(name, socket)
    socketServer.emit(SOCKET_EVENTS.CHAT_BROADCAST, {
      name: CHAT_TAG,
      message: `${name} has joined the game.`,
      isNotification: true,
    })
    callback()
  })

  socket.on(SOCKET_EVENTS.PLAYER_ACTION, (data: PlayerInputs) => {
    game.updatePlayerOnInput(socket.id, data)
  })

  socket.on(SOCKET_EVENTS.CHAT_SEND, (message: string) => {
    socketServer.emit(SOCKET_EVENTS.CHAT_BROADCAST, {
      name: game.players.getDisplayName(socket.id),
      message: message,
      isNotification: false,
    })
  })

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    const name = game.players.remove(socket.id)
    socketServer.sockets.emit(SOCKET_EVENTS.CHAT_BROADCAST, {
      name: CHAT_TAG,
      message: ` ${name} has left the game.`,
      isNotification: true,
    })
  })
})

game.start()

httpServer.on('error', (e) => {
  console.error(e)
})

// Starts the server.
httpServer.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
  if (DEBUG) {
    console.warn('DEBUG MODE ENABLED')
  }
})
