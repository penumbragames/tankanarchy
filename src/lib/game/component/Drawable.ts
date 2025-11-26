/**
 * Interface for objects that can be rendered on the canvas client side.
 * @author omgimanerd
 */

import Viewport from 'client/graphics/Viewport'

export interface IDrawable {
  render(context: CanvasRenderingContext2D, viewport: Viewport): void
}
