/**
 * Abstract class for drawable sprites.
 * @author omgimanerd
 */

import Vector from 'lib/math/Vector'

export type DrawingOptions = {
  // (x, y) and position are mutually exclusive arguments.
  x?: number
  y?: number
  position?: Vector

  width?: number
  height?: number

  centered?: boolean
  angle?: number
  opacity?: number
  frame?: number
}

type Context = CanvasRenderingContext2D

export abstract class Sprite {
  abstract getImage(frame: number | undefined): HTMLImageElement
  abstract get width(): number
  abstract get height(): number
  abstract draw(context: Context, options: DrawingOptions): void

  /**
   * Context manager helper that runs the given callback in a new sub-context of
   * a canvas rendering context.
   * @param context {Context} The canvas context to save state for.
   * @param callback {() => void} The function to execute in the new context.
   */
  newCanvasState(context: Context, callback: () => void) {
    context.save()
    callback()
    context.restore()
  }
}
