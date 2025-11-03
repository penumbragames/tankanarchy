/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as socket from 'socket.io-client'

import Canvas from 'client/graphics/Canvas'
import Renderer from 'client/graphics/Renderer'
import Input from 'client/Input'
import Leaderboard from 'client/Leaderboard'
import Particle from 'client/particle/Particle'
import SoundPlayer from 'client/sound/SoundPlayer'
import Viewport from 'client/Viewport'
import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import { Powerup } from 'lib/game/Powerup'
import Vector from 'lib/math/Vector'
import { SocketClient } from 'lib/socket/SocketClient'
import SOCKET_EVENTS from 'lib/socket/SocketEvents'
import { GameState, ParticleEvent } from 'lib/socket/SocketInterfaces'

class Game {
  socket: SocketClient

  // Helper objects
  canvas: Canvas
  viewport: Viewport
  renderer: Renderer
  input: Input
  leaderboard: Leaderboard
  soundManager: SoundPlayer

  // State from game update messages
  self: Player | null
  players: Player[]
  projectiles: Bullet[]
  powerups: Powerup[]

  // Particle system, only created from socket messages, not maintained by server.
  particles: Particle[]

  animationFrameId: number // Needed for requestAnimationFrame()
  lastUpdateTime: number
  deltaTime: number

  constructor(
    socket: SocketClient,
    canvas: Canvas,
    viewport: Viewport,
    drawing: Renderer,
    input: Input,
    leaderboard: Leaderboard,
    soundManager: SoundPlayer,
  ) {
    this.socket = socket

    this.canvas = canvas
    this.viewport = viewport
    this.renderer = drawing
    this.input = input
    this.leaderboard = leaderboard
    this.soundManager = soundManager

    this.self = null
    this.players = []
    this.projectiles = []
    this.powerups = []

    this.particles = []

    this.animationFrameId = 0
    this.lastUpdateTime = 0
    this.deltaTime = 0
  }

  static create(
    socket: socket.Socket,
    canvasElementID: string,
    leaderboardElementID: string,
  ): Game {
    const canvas = Canvas.getFromId(canvasElementID)
    canvas.matchCanvasSize()
    canvas.bindResizeListener()

    const viewport = Viewport.create(canvas)
    const renderer = Renderer.create(canvas, viewport)
    const input = Input.create(<HTMLElement>document.body, canvas.element)
    const leaderboard = Leaderboard.create(leaderboardElementID)

    const soundManager = new SoundPlayer(socket)

    const game = new Game(
      socket,
      canvas,
      viewport,
      renderer,
      input,
      leaderboard,
      soundManager,
    )
    game.init()
    return game
  }

  init(): void {
    this.lastUpdateTime = Date.now()
    this.socket.on(
      SOCKET_EVENTS.GAME_UPDATE,
      this.onReceiveGameState.bind(this),
    )
    this.socket.on(SOCKET_EVENTS.PARTICLE, this.onReceiveParticle.bind(this))
    this.soundManager.bindClientListener()
  }

  onReceiveGameState(state: GameState): void {
    this.self = state.self
    this.players = state.players
    this.projectiles = state.projectiles
    this.powerups = state.powerups

    this.viewport.updateTrackingPosition(state.self)
    this.leaderboard.update(state.players)
  }

  onReceiveParticle(particle: ParticleEvent): void {
    this.particles.push(new Particle(particle.type, particle.source))
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
      this.socket.emit(SOCKET_EVENTS.PLAYER_ACTION, {
        up: this.input.up,
        down: this.input.down,
        left: this.input.left,
        right: this.input.right,
        shoot: this.input.mouseDown,
        turretAngle: playerToMouseVector.angle,
      })

      for (let i = 0; i < this.particles.length; ++i) {
        const particle = this.particles[i]
        particle.update(this.lastUpdateTime, this.deltaTime)
        if (particle.destroyed) {
          this.particles.splice(i--, 1)
        }
      }
    }
  }

  draw(): void {
    if (this.self) {
      this.renderer.clear()
      this.renderer.drawTiles()

      this.projectiles.forEach(this.renderer.drawBullet.bind(this.renderer))
      this.powerups.forEach(this.renderer.drawPowerup.bind(this.renderer))
      this.renderer.drawTank(true, this.self)
      this.players
        .filter((player) => player.socketID !== this.self?.socketID)
        .forEach((tank) => this.renderer.drawTank(false, tank))

      this.particles.forEach(this.renderer.drawParticle.bind(this.renderer))

      this.renderer.drawBuffStatus(this.self)
    }
  }
}

export default Game
