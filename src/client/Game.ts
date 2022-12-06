/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants'
import * as socketIO from 'socket.io-client'

import Drawing from './Drawing'
import Entity from '../lib/Entity'
import Input from './Input'
import Leaderboard from './Leaderboard'
import Player from '../server/Player'
import Powerup from '../server/Powerup'
import Util from '../lib/Util'
import Vector from '../lib/Vector'
import Viewport from './Viewport'

class Game {
  socket: socketIO.Socket<
    Constants.SERVER_TO_CLIENT_EVENTS, Constants.CLIENT_TO_SERVER_EVENTS>

  viewport: Viewport
  drawing: Drawing
  input: Input
  leaderboard: Leaderboard

  self: Player | null
  players: Player[]
  projectiles: Entity[]
  powerups: Powerup[]

  animationFrameId: number
  lastUpdateTime: number
  deltaTime: number

  constructor(socket:socketIO.Socket, viewport:Viewport, drawing:Drawing,
              input:Input, leaderboard:Leaderboard) {
    this.socket = socket

    this.viewport = viewport
    this.drawing = drawing
    this.input = input
    this.leaderboard = leaderboard

    this.self = null
    this.players = []
    this.projectiles = []
    this.powerups = []

    this.animationFrameId = 0
    this.lastUpdateTime = 0
    this.deltaTime = 0
  }

  static create(socket:socketIO.Socket, canvasElementID:string,
                leaderboardElementID:string):Game {
    const canvas = <HTMLCanvasElement>document.getElementById(canvasElementID)
    canvas.width = Constants.CANVAS_WIDTH
    canvas.height = Constants.CANVAS_HEIGHT

    const viewport = Viewport.create(canvas)
    const drawing = Drawing.create(canvas, viewport)
    const input = Input.create(<HTMLElement>document.body, canvas)
    const leaderboard = Leaderboard.create(leaderboardElementID)

    const game = new Game(socket, viewport, drawing, input, leaderboard)
    game.init()
    return game
  }

  init() {
    this.lastUpdateTime = Date.now()
    this.socket.on(Constants.SOCKET.UPDATE,
                   this.onReceiveGameState.bind(this))
  }

  onReceiveGameState(state:Constants.GAME_STATE) {
    this.self = state.self
    this.players = state.players
    this.projectiles = state.projectiles
    this.powerups = state.powerups

    this.viewport.updateTrackingPosition(state.self)
    this.leaderboard.update(state.players)
  }

  run() {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    this.update()
    this.draw()
    this.animationFrameId = window.requestAnimationFrame(this.run.bind(this))
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  update() {
    if (this.self) {
      this.viewport.update(this.deltaTime)
      const absoluteMouseCoords = this.viewport.toWorld(this.input.mouseCoords)
      const playerToMouseVector = Vector.sub(this.self.position,
                                             absoluteMouseCoords)

      this.socket.emit(Constants.SOCKET.PLAYER_ACTION, {
        up: this.input.up,
        down: this.input.down,
        left: this.input.left,
        right: this.input.right,
        shoot: this.input.mouseDown,
        turretAngle: Util.normalizeAngle(playerToMouseVector.angle + Math.PI),
      })
    }
  }

  draw() {
    if (this.self) {
      this.drawing.clear()

      this.drawing.drawTiles()

      this.projectiles.forEach(this.drawing.drawBullet.bind(this.drawing))

      this.powerups.forEach(this.drawing.drawPowerup.bind(this.drawing))

      this.drawing.drawTank(true, this.self)
      this.players.forEach(tank => this.drawing.drawTank(false, tank))
    }
  }
}

export default Game
