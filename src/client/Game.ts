/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as socket from 'socket.io-client'

import SOCKET_EVENTS from 'lib/socket/SocketEvents'

import Canvas from 'client/graphics/Canvas'
import Renderer from 'client/graphics/Renderer'
import Viewport from 'client/graphics/Viewport'
import Input from 'client/Input'
import Particle from 'client/particle/Particle'
import SoundPlayer from 'client/sound/SoundPlayer'
import Debug from 'client/ui/Debug'
import Leaderboard from 'client/ui/Leaderboard'
import GameLoop from 'lib/game/GameLoop'
import Vector from 'lib/math/Vector'
import { SocketClient } from 'lib/socket/SocketClient'
import {
  GameState,
  ParticleDrawingLayer,
  ParticleEvent,
} from 'lib/socket/SocketInterfaces'

type ParticleLayers = {
  [ParticleDrawingLayer.PRE_ENTITY]: Particle[]
  [ParticleDrawingLayer.POST_ENTITY]: Particle[]
}

export default class Game {
  static readonly INPUT_UPS = 30

  socket: SocketClient

  // Helper objects
  canvas: Canvas
  viewport: Viewport
  renderer: Renderer
  input: Input
  leaderboard: Leaderboard
  soundManager: SoundPlayer

  // State from game update messages
  state: GameState | null = null

  // Particle system, only created from socket messages, not maintained by
  // server.
  particles: ParticleLayers = {
    [ParticleDrawingLayer.PRE_ENTITY]: [],
    [ParticleDrawingLayer.POST_ENTITY]: [],
  }

  // Separate game loops for sending input and rendering, input sends at a lower
  // rate than render, which attempts to do so as fast as possible.
  inputLoop: GameLoop
  updateAndRenderLoop: GameLoop

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

    this.inputLoop = new GameLoop(Game.INPUT_UPS, this.sendInput.bind(this))
    this.updateAndRenderLoop = new GameLoop(
      Infinity,
      this.updateAndRender.bind(this),
      /*useAnimationFrame=*/ true,
    )
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
    ).init()
    return game
  }

  init(): Game {
    this.socket.on(
      SOCKET_EVENTS.GAME_UPDATE,
      this.onReceiveGameState.bind(this),
    )
    this.socket.on(SOCKET_EVENTS.PARTICLE, this.onReceiveParticle.bind(this))
    this.soundManager.bindClientListener()
    return this
  }

  /**
   * Socket event handler to receive game state.
   * @param state
   */
  onReceiveGameState(state: GameState): void {
    this.state = state

    this.viewport.updateTrackingPosition(state.self)
    this.leaderboard.update(state.players)
  }

  /**
   * Socket event handler to receive particle state.
   * @param particle
   */
  onReceiveParticle(particle: ParticleEvent): void {
    this.particles[particle.options.layer].push(
      new Particle(particle.type, particle.source, particle?.options),
    )
  }

  start(): void {
    this.inputLoop.start()
    this.updateAndRenderLoop.start()
  }

  stop(): void {
    this.inputLoop.stop()
    this.updateAndRenderLoop.stop()
  }

  sendInput(): void {
    if (this.state?.self) {
      const worldMouseCoords = this.viewport.toWorld(this.input.mouseCoords)
      const playerToMouseVector = Vector.sub(
        worldMouseCoords,
        this.state.self.physics.position,
      )
      this.socket.emit(SOCKET_EVENTS.PLAYER_ACTION, {
        up: this.input.up,
        down: this.input.down,
        left: this.input.left,
        right: this.input.right,
        worldMouseCoords: worldMouseCoords,
        turretAngle: playerToMouseVector.angle,
        mouseLeft: this.input.mouseLeft,
        mouseRight: this.input.mouseRight,
      })
    }
  }

  updateAndRender(): void {
    if (this.state?.self) {
      // Update step with the server state
      this.viewport.update(this.updateAndRenderLoop.updateFrame)
      this.soundManager.update(this.state.self.physics.position)

      // Update particle system, which is only maintained client side
      this.particles[ParticleDrawingLayer.PRE_ENTITY] = this.particles[
        ParticleDrawingLayer.PRE_ENTITY
      ]
        .map((particle: Particle) => {
          particle.update(this.updateAndRenderLoop.updateFrame)
          return particle
        })
        .filter((particle: Particle) => !particle.destroyed)
      this.particles[ParticleDrawingLayer.POST_ENTITY] = this.particles[
        ParticleDrawingLayer.POST_ENTITY
      ]
        .map((particle: Particle) => {
          particle.update(this.updateAndRenderLoop.updateFrame)
          return particle
        })
        .filter((particle: Particle) => !particle.destroyed)

      // Render Step
      this.renderer.clear()
      this.renderer.drawTiles()

      this.particles[ParticleDrawingLayer.PRE_ENTITY].forEach(
        this.renderer.drawParticle.bind(this.renderer),
      )

      this.state.entities.forEach(this.renderer.drawEntity.bind(this.renderer))
      this.renderer.drawTank(true, this.state.self)
      this.state.players
        .filter((player) => player.socketID !== this.state?.self?.socketID)
        .forEach((tank) => this.renderer.drawTank(false, tank))

      this.particles[ParticleDrawingLayer.POST_ENTITY].forEach(
        this.renderer.drawParticle.bind(this.renderer),
      )

      this.renderer.drawBuffStatus(this.state.self)
      this.renderer.drawCrosshair(this.state.self, this.input)

      const debug = Debug.get()
      debug.update(this.updateAndRenderLoop.updateFrame)
      debug.setDisplayValue('server ups', this.state.debug?.ups?.toFixed(2))
      debug.setDisplayValue(
        'client render fps',
        this.updateAndRenderLoop.ups.toFixed(2),
      )
    }
  }
}
