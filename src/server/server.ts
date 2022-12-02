/**
 * This is the server app script that is run on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as express from 'express'
import * as http from 'http'
import * as morgan from 'morgan'
import * as path from 'path'
import * as socket from 'socket.io'

import * as Constants from '../lib/Constants'
import Game from './Game'

const PORT = process.env.PORT || 5000
const FRAME_RATE = 1000 / 60
const CHAT_TAG = '[Tank Anarchy]'

console.log(Constants.SOCKET.UPDATE)

// Initialization.
const app = express()
const httpServer = http.createServer(app)
const io = new socket.Server(httpServer)
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
 * game based on the input it receives. Everything runs asynchronously with
 * the game loop.
 */
io.on('connection', socket => {
  socket.on(Constants.SOCKET.NEW_PLAYER, (data, callback) => {
    game.addNewPlayer(data.name, socket)
    io.sockets.emit(Constants.SOCKET.CHAT_SERVER_CLIENT, {
      name: CHAT_TAG,
      message: `${data.name} has joined the game.`,
      isNotification: true
    })
    callback()
  })

  socket.on(Constants.SOCKET.PLAYER_ACTION, data => {
    game.updatePlayerOnInput(socket.id, data)
  })

  socket.on(Constants.SOCKET.CHAT_CLIENT_SERVER, data => {
    io.sockets.emit(Constants.SOCKET.CHAT_SERVER_CLIENT, {
      name: game.getPlayerNameBySocketId(socket.id),
      message: data
    })
  })

  socket.on(Constants.SOCKET.DISCONNECT, () => {
    const name = game.removePlayer(socket.id)
    io.sockets.emit(Constants.SOCKET.CHAT_SERVER_CLIENT, {
      name: CHAT_TAG,
      message: ` ${name} has left the game.`,
      isNotification: true
    })
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
