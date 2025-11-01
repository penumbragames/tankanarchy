/**
 * Manages the player viewport when they move around.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Canvas from 'client/graphics/Canvas'
import Entity from 'lib/game/Entity'
import Player from 'lib/game/Player'
import Vector from 'lib/math/Vector'

class Viewport extends Entity {
  static readonly UNINITIALIZED = new Vector(-99999, -99999)
  static readonly STICKINESS = 0.005

  playerPosition: Vector
  canvas: Canvas

  /**
   * Constructor for a Viewport object. The position of the viewport will hold
   * the absolute world coordinates for the top left of the view (which
   * correspond to canvas coordinates [width / 2, height / 2]).
   * @param {Vector} position The starting position of the viewport
   * @param {Vector} velocity The starting velocity of the viewport
   * @param {Canvas} canvas The canvas that the game is rendering on
   */
  constructor(position: Vector, velocity: Vector, canvas: Canvas) {
    super(position, velocity, Vector.zero(), 0)

    this.playerPosition = Vector.zero()
    this.canvas = canvas
  }

  static create(canvas: Canvas): Viewport {
    return new Viewport(Viewport.UNINITIALIZED, Viewport.UNINITIALIZED, canvas)
  }

  updateTrackingPosition(player: Player): void {
    this.playerPosition = Vector.sub(player.position, this.canvas.center)
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
      Viewport.STICKINESS * deltaTime,
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
