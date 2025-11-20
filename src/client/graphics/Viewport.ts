/**
 * Manages the player viewport when they move around.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Canvas from 'client/graphics/Canvas'
import { IPhysics, Physics } from 'lib/game/component/Physics'
import { IUpdateable, UpdateFrame } from 'lib/game/component/Updateable'
import Player from 'lib/game/entity/player/Player'
import Vector from 'lib/math/Vector'

class Viewport implements IPhysics, IUpdateable {
  static readonly UNINITIALIZED = new Vector(-99999, -99999)
  static readonly STICKINESS = 0.005

  physics: Physics

  playerPosition: Vector // tracks the position of the self player
  canvas: Canvas

  /**
   * @param {Canvas} canvas The canvas that the game is rendering on
   */
  constructor(canvas: Canvas) {
    this.physics = new Physics(
      Viewport.UNINITIALIZED,
      Vector.zero(),
      Vector.zero(),
    )
    this.playerPosition = Vector.zero()
    this.canvas = canvas
  }

  static create(canvas: Canvas): Viewport {
    return new Viewport(canvas)
  }

  updateTrackingPosition(player: Player): void {
    this.playerPosition = Vector.sub(
      player.physics.position,
      this.canvas.center,
    )
  }

  update(updateFrame: UpdateFrame): void {
    if (
      this.physics.position == Viewport.UNINITIALIZED ||
      this.physics.velocity == Viewport.UNINITIALIZED
    ) {
      this.physics.position = this.playerPosition
      this.physics.velocity = Vector.zero()
      return
    }
    this.physics.velocity = Vector.sub(
      this.playerPosition,
      this.physics.position,
    ).scale(Viewport.STICKINESS * updateFrame.deltaTime)
    this.physics.position.add(this.physics.velocity)
  }

  /**
   * Converts an absolute world coordinate to a position on the canvas in this
   * viewport's field of view.
   * @param {Vector} position The absolute world coordinate to convert.
   * @return {Vector}
   */
  toCanvas(position: Vector): Vector {
    return Vector.sub(position, this.physics.position)
  }

  /**
   * Converts a canvas coordinate to an absolute world coordinate in this
   * viewport's field of view.
   * @param {Vector} position The canvas coordinate to convert
   * @return {Vector}
   */
  toWorld(position: Vector): Vector {
    return Vector.add(position, this.physics.position)
  }
}

export default Viewport
