/**
 * This is the server app script that is run on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants'

import * as express from 'express'
import * as http from 'http'
import * as morgan from 'morgan'
import * as path from 'path'
import * as socket from 'socket.io'

import Game from './Game'

const PORT = process.env.PORT || 5000
const FRAME_RATE = 1000 / 60
const CHAT_TAG = '[Tank Anarchy]'

const app = express()
const httpServer = http.createServer(app)
const io = new socket.Server<
  Constants.CLIENT_TO_SERVER_EVENTS, Constants.SERVER_TO_CLIENT_EVENTS,
  Constants.SERVER_TO_SERVER_EVENTS, Constants.SOCKET_DATA>(httpServer)
const game = new Game()

app.set('port', PORT)

app.use(morgan('dev'))
app.use('/dist', express.static(path.join(__dirname, '/dist')))

// Routing
app.get('/', (_request: express.Request, response: express.Response) => {
  response.sendFile(path.join(__dirname, 'views/index.html'))
})

/**
 * Server side input handler, modifies the state of the players and the
 * game based on the input it receives.
 */
io.on('connection', (playerSocket:socket.Socket) => {
  playerSocket.on(Constants.SOCKET.NEW_PLAYER, (name:string) => {
    game.addNewPlayer(name, playerSocket)
    io.emit(Constants.SOCKET.CHAT_SERVER_CLIENT,
            CHAT_TAG,
            `${name} has joined the game.`,
            true)
    return true
  })

  playerSocket.on(Constants.SOCKET.PLAYER_ACTION,
                  (data:Constants.PLAYER_INPUTS) => {
                    game.updatePlayerOnInput(playerSocket.id, data)
                  })

  playerSocket.on(Constants.SOCKET.CHAT_CLIENT_SERVER,
                  (message:string) => {
                    io.emit(Constants.SOCKET.CHAT_SERVER_CLIENT,
                            game.getPlayerNameBySocketId(playerSocket.id),
                            message,
                            false)
                  })

  playerSocket.on(Constants.SOCKET.DISCONNECT, () => {
    const name = game.removePlayer(playerSocket.id)
    io.sockets.emit(
      Constants.SOCKET.CHAT_SERVER_CLIENT,
      CHAT_TAG,
      ` ${name} has left the game.`,
      true,
    )
  })
})

/**
 * Server side game loop, runs at 60Hz and sends out update packets to all
 * clients every update.
 */
setInterval(() => {
  game.update()
  game.sendState()
}, FRAME_RATE)

// Starts the server.
httpServer.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`)
})
