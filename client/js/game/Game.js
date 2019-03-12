/**
 * Class encapsulating the client side of the game, handles drawing and
 * updates.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

const Drawing = require('./Drawing')
const Input = require('./Input')
const Leaderboard = require('./Leaderboard')
const Viewport = require('./Viewport')

const Constants = require('../../shared/Constants')
const Vector = require('../../shared/Vector')

/**
 * Game class.
 */
class Game {
  /**
   * Creates a Game class.
   * @param {Socket} socket The socket connected to the server
   * @param {Viewport} viewport The Viewport object for coordinate translation
   * @param {Drawing} drawing The Drawing object for canvas rendering
   * @param {Input} input The Input object for tracking user input
   * @param {Leaderboard} leaderboard The Leaderboard object handling the
   *   leaderboard update
   */
  constructor(socket, viewport, drawing, input, leaderboard) {
    this.socket = socket

    this.viewport = viewport
    this.drawing = drawing
    this.input = input
    this.leaderboard = leaderboard

    this.self = null
    this.players = []
    this.projectiles = []
    this.powerups = []

    this.animationFrameId = null
  }

  /**
   * Factory method for creating a Game class instance.
   * @param {Socket} socket The socket connected to the server
   * @param {string} canvasElementID The ID of the canvas element to render the
   *   game to
   * @param {string} leaderboardElementID The ID of the DOM element which will
   *   hold the leaderboard
   * @return {Game}
   */
  static create(socket, canvasElementID, leaderboardElementID) {
    const canvas = document.getElementByID(canvasElementID)
    canvas.width = Constants.CANVAS_WIDTH
    canvas.height = Constants.CANVAS_HEIGHT

    const viewport = Viewport.create(canvas)
    const drawing = Drawing.create(canvas, viewport)
    const input = Input.create(document, canvas)

    const leaderboardElement = document.getElementByID(leaderboardElementID)
    const leaderboard = Leaderboard.create(leaderboardElement)

    const game = new Game(socket, drawing, input, leaderboard)
    game.init()
    return game
  }

  /**
   * Initializes the Game object and binds the socket event listener.
   */
  init() {
    this.socket.on('update', this.onReceiveGameState.bind(this))
  }

  /**
   * Socket event handler.
   * @param {Object} state The game state received from the server
   */
  onReceiveGameState(state) {
    this.self = state.self
    this.players = state.players
    this.projectiles = state.projectiles
    this.powerups = state.powerups

    this.leaderboard.update(state.leaderboard)
  }

  /**
   * Starts the animation and update loop to run the game.
   */
  run() {
    this.update()
    this.draw()
    this.animationFrameId = window.requestAnimationFrame(this.run.bind(this))
  }

  /**
   * Stops the animation and update loop for the game.
   */
  stop() {
    window.cancelAnimationFrame(this.animationFrameId)
  }

  /**
   * Updates the client state of the game and sends user input to the server.
   */
  update() {
    if (this.self) {
      this.viewport.update(this.self.position)

      const absoluteMouseCoords = this.viewport.toWorld(
        Vector.fromArray(this.input.mouseCoords))
      const playerToMouseVector = Vector.fromArray(this.input.mouseCoords).sub(
        absoluteMouseCoords)

      this.socket.emit('player-action', {
        up: this.input.up,
        down: this.input.down,
        left: this.input.left,
        right: this.input.right,
        shoot: this.input.mouseDown,
        turretAngle: playerToMouseVector.angle
      })
    }
  }

  /**
   * Draws the state of the game to the canvas.
   */
  draw() {
    if (this.self) {
      this.drawing.clear()

      this.drawing.drawTiles()

      this.projectiles.forEach(this.drawing.drawBullet)

      this.powerups.forEach(this.drawing.drawPowerup)

      this.drawing.drawTank(true, this.self)
      this.players.forEach(tank => this.drawTank(false, tank))
    }
  }
}

module.exports = Game
