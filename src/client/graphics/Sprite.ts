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

// Matches the API for CanvasRenderingContext2D.drawImage's image argument.
export type Drawable =
  | HTMLImageElement
  | SVGImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas
  | VideoFrame

type Context = CanvasRenderingContext2D

export abstract class Sprite {
  abstract getImage(frame: number | undefined): Drawable
  abstract get frames(): number
  abstract get width(): number
  abstract get height(): number

  draw(context: Context, options: DrawingOptions) {
    if (
      options.position !== undefined &&
      (options.x !== undefined || options.y !== undefined)
    ) {
      throw new Error(
        'Cannot specify position args and x/y args at the same time.',
      )
    }
    const x = options.position?.x ?? options.x
    const y = options.position?.y ?? options.y
    const width = options.width ?? this.width
    const height = options.height ?? this.height
    // For the x/y options, we will translate by that amount in order to set the
    // image in the right place, and use the x/y drawImage() arguments to offset
    // the image when we need to center it about the drawing point.
    const drawX = options.centered ? -width / 2 : 0
    const drawY = options.centered ? -height / 2 : 0
    this.newCanvasState(context, () => {
      const oldOpacity = context.globalAlpha
      if (options.opacity) {
        context.globalAlpha = options.opacity
      }
      if (x !== undefined || y !== undefined) {
        context.translate(x ?? 0, y ?? 0)
      }
      if (options.angle) {
        context.rotate(options.angle)
      }
      context.drawImage(
        this.getImage(options.frame),
        drawX, // dx
        drawY, // dy
        width, // dWidth
        height, // dHeight
      )
      // Reset the opacity only if we changed it.
      if (options.opacity) {
        context.globalAlpha = oldOpacity
      }
    })
  }

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
