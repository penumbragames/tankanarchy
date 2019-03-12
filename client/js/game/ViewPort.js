/**
 * Manages the player viewport when they move around.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

const Entity = require('../../lib/Entity')
const Vector = require('../../lib/Vector')

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
   * Updates the velocity nad position of the viewport.
   * @param {Vector} playerPosition The absolute world coordinates of the
   *   player
   */
  update(playerPosition) {
    super.update()
    const translatedPlayer = Vector.sub(playerPosition, this.canvasOffset)
    this.velocity = Vector.sub(this.position, translatedPlayer).scale(
      0.001 * this.deltaTime)
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
