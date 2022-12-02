/**
 * Manages the player viewport when they move around.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const Constants = require('../../../lib/Constants')
const Entity = require('../../../lib/Entity')
const Vector = require('../../../lib/Vector')

/**
 * Viewport class.
 */
class Viewport extends Entity {
  /**
   * Constructor for a Viewport object. The position of the viewport will hold
   * the absolute world coordinates for the top left of the view (which
   * correspond to canvas coordinates [width / 2, height / 2]).
   * @param {Vector} position The starting position of the viewport
   * @param {Vector} velocity The starting velocity of the viewport
   * @param {number} canvasWidth The width of the canvas for this viewport
   * @param {number} canvasHeight The height of the canvas for this viewport
   */
  constructor(position, velocity, canvasWidth, canvasHeight) {
    super(position, velocity)

    this.playerPosition = null
    this.canvasOffset = new Vector(canvasWidth / 2, canvasHeight / 2)
  }

  /**
   * Create a Viewport object.
   * @param {Element} canvas The canvas element this viewport represents
   * @return {Viewport}
   */
  static create(canvas) {
    return new Viewport(
      Vector.zero(), Vector.zero(), canvas.width, canvas.height)
  }

  /**
   * Update the viewport with the relative player position it should track.
   * @param {Player} player The player to track
   */
  updateTrackingPosition(player) {
    this.playerPosition = Vector.sub(player.position, this.canvasOffset)
  }

  /**
   * Updates the velocity and position of the viewport.
   * @param {number} deltaTime The timestep to perform the update with
   */
  update(deltaTime) {
    this.velocity = Vector.sub(this.playerPosition, this.position).scale(
      Constants.VIEWPORT_STICKINESS * deltaTime)
    this.position.add(this.velocity)
  }

  /**
   * Converts an absolute world coordinate to a position on the canvas in this
   * viewport's field of view.
   * @param {Vector} position The absolute world coordinate to convert.
   * @return {Vector}
   */
  toCanvas(position) {
    return Vector.sub(position, this.position)
  }

  /**
   * Converts a canvas coordinate to an absolute world coordinate in this
   * viewport's field of view.
   * @param {Vector} position The canvas coordinate to convert
   * @return {Vector}
   */
  toWorld(position) {
    return Vector.add(position, this.position)
  }
}

module.exports = Viewport
