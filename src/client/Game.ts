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
import SoundPlayer from 'client/sound/SoundPlayer'
import Viewport from 'client/Viewport'
import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import Powerup from 'lib/game/Powerup'
import * as Interfaces from 'lib/Interfaces'
import Vector from 'lib/math/Vector'

type ClientSocket = socketIO.Socket<
  Interfaces.SERVER_TO_CLIENT_EVENTS,
  Interfaces.CLIENT_TO_SERVER_EVENTS
>

class Game {
  socket: ClientSocket

  // Helper objects
  canvas: Canvas
  viewport: Viewport
  drawing: Drawing
  input: Input
  leaderboard: Leaderboard
  soundManager: SoundPlayer

  // Internal state
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
    soundManager: SoundPlayer,
  ) {
    this.socket = socket

    this.canvas = canvas
    this.viewport = viewport
    this.drawing = drawing
    this.input = input
    this.leaderboard = leaderboard
    this.soundManager = soundManager

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

    const soundManager = new SoundPlayer(socket)

    const game = new Game(
      socket,
      canvas,
      viewport,
      drawing,
      input,
      leaderboard,
      soundManager,
    )
    game.init()
    return game
  }

  init(): void {
    this.lastUpdateTime = Date.now()
    this.socket.on(Interfaces.SOCKET.UPDATE, this.onReceiveGameState.bind(this))
    this.soundManager.bindClientListener()
  }

  onReceiveGameState(state: Interfaces.GAME_STATE): void {
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
      this.soundManager.update(this.self.position)
      const worldMouseCoords = this.viewport.toWorld(this.input.mouseCoords)
      const playerToMouseVector = Vector.sub(
        worldMouseCoords,
        this.self.position,
      )
      this.socket.emit(Interfaces.SOCKET.PLAYER_ACTION, {
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

      this.drawing.drawBuffStatus(this.self)
    }
  }
}

export default Game
