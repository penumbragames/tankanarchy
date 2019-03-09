/**
 * This is the server app script that is run on the server.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const PORT = process.env.PORT || 5000
const FRAME_RATE = 1000 / 60

// Dependencies.
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const path = require('path')
const socketIO = require('socket.io')

const Game = require('./lib/Game')

// Initialization.
const app = express()
const server = http.Server(app)
const io = socketIO(server)
const game = new Game()

app.set('port', PORT)

app.use(morgan('dev'))
app.use('/dist', express.static(path.join(__dirname, '/dist')))

// Routing
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'views/index.html'))
})

/**
 * Server side input handler, modifies the state of the players and the
 * game based on the input it receives. Everything runs asynchronously with
 * the game loop.
 */
io.on('connection', socket => {
  // When a new player joins, the server adds a new player to the game.
  socket.on('new-player', (data, callback) => {
    game.addNewPlayer(data.name, socket)
    io.sockets.emit('chat-server-to-clients', {
      name: '[Tank Anarchy]',
      message: `${data.name} has joined the game.`,
      isNotification: true
    })
    callback()
  })

  /**
   * Update the internal object states every time a player sends an intent
   * packet.
   */
  socket.on('player-action', data => {
    game.updatePlayer(
      socket.id, data.keyboardState, data.turretAngle, data.shot,
      data.timestamp)
  })

  socket.on('chat-client-to-server', data => {
    io.sockets.emit('chat-server-to-clients', {
      name: game.getPlayerNameBySocketId(socket.id),
      message: data
    })
  })

  // When a player disconnects, remove them from the game.
  socket.on('disconnect', () => {
    const name = game.removePlayer(socket.id)
    io.sockets.emit('chat-server-to-clients', {
      name: '[Tank Anarchy]',
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
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Starting server on port ${PORT}`)
})
