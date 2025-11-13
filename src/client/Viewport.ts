/**
 * Manages the player viewport when they move around.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Canvas from 'client/graphics/Canvas'
import PhysObject from 'lib/game/PhysObject'
import Player from 'lib/game/entity/Player'
import Vector from 'lib/math/Vector'

class Viewport extends PhysObject {
  static readonly UNINITIALIZED = new Vector(-99999, -99999)
  static readonly STICKINESS = 0.005

  playerPosition: Vector
  canvas: Canvas

  /**
   * @param {Vector} position The starting position of the viewport, represents
   *   the center of the view.
   * @param {Canvas} canvas The canvas that the game is rendering on
   */
  constructor(position: Vector, canvas: Canvas) {
    super(position, Vector.zero(), Vector.zero())

    this.playerPosition = Vector.zero()
    this.canvas = canvas
  }

  static create(canvas: Canvas): Viewport {
    return new Viewport(Viewport.UNINITIALIZED, canvas)
  }

  updateTrackingPosition(player: Player): void {
    this.playerPosition = Vector.sub(player.position, this.canvas.center)
  }

  override update(_lastUpdateTime: number, deltaTime: number): void {
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
