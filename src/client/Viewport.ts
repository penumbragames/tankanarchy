/**
 * Manages the player viewport when they move around.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants'
import Entity from '../lib/Entity'
import Player from '../server/Player'
import Vector from '../lib/Vector'

class Viewport extends Entity {
  playerPosition: Vector
  canvasOffset: Vector

  static readonly UNINITIALIZED: Vector = new Vector(-99999, -99999)

  /**
   * Constructor for a Viewport object. The position of the viewport will hold
   * the absolute world coordinates for the top left of the view (which
   * correspond to canvas coordinates [width / 2, height / 2]).
   * @param {Vector} position The starting position of the viewport
   * @param {Vector} velocity The starting velocity of the viewport
   * @param {number} canvasWidth The width of the canvas for this viewport
   * @param {number} canvasHeight The height of the canvas for this viewport
   */
  constructor(
    position: Vector,
    velocity: Vector,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    super(position, velocity, Vector.zero(), 0)

    this.playerPosition = Vector.zero()
    this.canvasOffset = new Vector(canvasWidth / 2, canvasHeight / 2)
  }

  static create(canvas: HTMLCanvasElement): Viewport {
    return new Viewport(
      Viewport.UNINITIALIZED,
      Viewport.UNINITIALIZED,
      canvas.width,
      canvas.height,
    )
  }

  updateTrackingPosition(player: Player): void {
    this.playerPosition = Vector.sub(player.position, this.canvasOffset)
  }

  update(deltaTime: number): void {
    if (
      this.position == Viewport.UNINITIALIZED ||
      this.velocity == Viewport.UNINITIALIZED
    ) {
      this.position = this.playerPosition
      this.velocity = Vector.zero()
      return
    }
    this.velocity = Vector.sub(this.playerPosition, this.position).scale(
      Constants.VIEWPORT_STICKINESS * deltaTime,
    )
    this.position.add(this.velocity)
  }

  /**
   * Converts an absolute world coordinate to a position on the canvas in this
   * viewport's field of view.
   * @param {Vector} position The absolute world coordinate to convert.
   * @return {Vector}
   */
  toCanvas(position: Vector): Vector {
    return Vector.sub(position, this.position)
  }

  /**
   * Converts a canvas coordinate to an absolute world coordinate in this
   * viewport's field of view.
   * @param {Vector} position The canvas coordinate to convert
   * @return {Vector}
   */
  toWorld(position: Vector): Vector {
    return Vector.add(position, this.position)
  }
}

export default Viewport
