/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as socketIO from 'socket.io-client'

import Canvas from 'client/Canvas'
import Drawing from 'client/Drawing'
import Input from 'client/Input'
import Leaderboard from 'client/Leaderboard'
import Viewport from 'client/Viewport'
import * as Constants from 'lib/Constants'
import Vector from 'lib/Vector'
import Bullet from 'server/Bullet'
import Player from 'server/Player'
import Powerup from 'server/Powerup'

type ClientSocket = socketIO.Socket<
  Constants.SERVER_TO_CLIENT_EVENTS,
  Constants.CLIENT_TO_SERVER_EVENTS
>

class Game {
  socket: ClientSocket

  canvas: Canvas
  viewport: Viewport
  drawing: Drawing
  input: Input
  leaderboard: Leaderboard

  self: Player | null
  players: Player[]
  projectiles: Bullet[]
  powerups: Powerup[]

  animationFrameId: number
  lastUpdateTime: number
  deltaTime: number

  constructor(
    socket: ClientSocket,
    canvas: Canvas,
    viewport: Viewport,
    drawing: Drawing,
    input: Input,
    leaderboard: Leaderboard,
  ) {
    this.socket = socket

    this.canvas = canvas
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

  static create(
    socket: socketIO.Socket,
    canvasElementID: string,
    leaderboardElementID: string,
  ): Game {
    const canvas = Canvas.getFromId(canvasElementID)
    canvas.matchCanvasSize()
    canvas.bindResizeListener()

    const viewport = Viewport.create(canvas)
    const drawing = Drawing.create(canvas, viewport)
    const input = Input.create(<HTMLElement>document.body, canvas.element)
    const leaderboard = Leaderboard.create(leaderboardElementID)

    const game = new Game(socket, canvas, viewport, drawing, input, leaderboard)
    game.init()
    return game
  }

  init(): void {
    this.lastUpdateTime = Date.now()
    this.socket.on(Constants.SOCKET.UPDATE, this.onReceiveGameState.bind(this))
  }

  onReceiveGameState(state: Constants.GAME_STATE): void {
    this.self = state.self
    this.players = state.players
    this.projectiles = state.projectiles
    this.powerups = state.powerups

    this.viewport.updateTrackingPosition(state.self)
    this.leaderboard.update(state.players)
  }

  run(): void {
    const currentTime = Date.now()
    this.deltaTime = currentTime - this.lastUpdateTime
    this.lastUpdateTime = currentTime

    this.update()
    this.draw()
    this.animationFrameId = window.requestAnimationFrame(this.run.bind(this))
  }

  stop(): void {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  update(): void {
    if (this.self) {
      this.viewport.update(this.deltaTime)
      const worldMouseCoords = this.viewport.toWorld(this.input.mouseCoords)
      const playerToMouseVector = Vector.sub(
        worldMouseCoords,
        this.self.position,
      )
      this.socket.emit(Constants.SOCKET.PLAYER_ACTION, {
        up: this.input.up,
        down: this.input.down,
        left: this.input.left,
        right: this.input.right,
        shoot: this.input.mouseDown,
        turretAngle: playerToMouseVector.angle,
      })
    }
  }

  draw(): void {
    if (this.self) {
      this.drawing.clear()
      this.drawing.drawTiles()

      this.projectiles.forEach(this.drawing.drawBullet.bind(this.drawing))
      this.powerups.forEach(this.drawing.drawPowerup.bind(this.drawing))
      this.drawing.drawTank(true, this.self)
      this.players
        .filter((player) => player.socketID !== this.self?.socketID)
        .forEach((tank) => this.drawing.drawTank(false, tank))
    }
  }
}

export default Game
