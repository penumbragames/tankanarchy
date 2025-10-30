/**
 * This is the server app script that is run on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import 'reflect-metadata'

import express from 'express'
import http from 'http'
import morgan from 'morgan'
import path from 'node:path'
import * as socketIO from 'socket.io'

import * as Interfaces from 'lib/Interfaces'
import SocketParser from 'lib/serialization/SocketParser'
import Game from 'server/Game'

const PORT = process.env.PORT || 5000
const FRAME_RATE = 1000 / 60
const CHAT_TAG = '[Tank Anarchy]'
const DIRNAME = import.meta.dirname

const app: express.Application = express()
const httpServer = http.createServer(app)
const io = new socketIO.Server<
  Interfaces.CLIENT_TO_SERVER_EVENTS,
  Interfaces.SERVER_TO_CLIENT_EVENTS,
  Interfaces.SERVER_TO_SERVER_EVENTS,
  Interfaces.SOCKET_DATA
>(httpServer, { parser: SocketParser })
const game = new Game()

app.set('port', PORT)

app.use(morgan('dev'))
app.use(express.static(DIRNAME))

// Routing
app.get('/', (_, res) => {
  res.sendFile(path.join(DIRNAME, '../html/index.html'))
})
app.get('/styles.css', (_, res) => {
  res.sendFile(path.join(DIRNAME, '../dist/styles.css'))
})
app.get('/client.js', (_, res) => {
  res.sendFile(path.join(DIRNAME, '../dist/client.js'))
})
app.use('/img/', express.static(path.join(DIRNAME, '../img/')))

/**
 * Server side input handler, modifies the state of the players and the
 * game based on the input it receives.
 */
io.on('connection', (socket: socketIO.Socket) => {
  socket.on(
    Interfaces.SOCKET.NEW_PLAYER,
    (name: string, callback: () => void) => {
      game.addNewPlayer(name, socket)
      io.emit(Interfaces.SOCKET.CHAT_SERVER_CLIENT, {
        name: CHAT_TAG,
        message: `${name} has joined the game.`,
        isNotification: true,
      })
      callback()
    },
  )

  socket.on(
    Interfaces.SOCKET.PLAYER_ACTION,
    (data: Interfaces.PLAYER_INPUTS) => {
      game.updatePlayerOnInput(socket.id, data)
    },
  )

  socket.on(Interfaces.SOCKET.CHAT_CLIENT_SERVER, (message: string) => {
    io.emit(Interfaces.SOCKET.CHAT_SERVER_CLIENT, {
      name: game.getPlayerNameBySocketId(socket.id),
      message: message,
      isNotification: false,
    })
  })

  socket.on(Interfaces.SOCKET.DISCONNECT, () => {
    const name = game.removePlayer(socket.id)
    io.sockets.emit(Interfaces.SOCKET.CHAT_SERVER_CLIENT, {
      name: CHAT_TAG,
      message: ` ${name} has left the game.`,
      isNotification: true,
    })
  })
})

/**
 * Server side game loop, runs at 60Hz and sends out update packets to all
 * clients every update.
 */
const gameLoop = () => {
  game.update()
  game.sendState()
  setTimeout(gameLoop, FRAME_RATE)
}
gameLoop()

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
