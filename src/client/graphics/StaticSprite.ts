/**
 * Class encapsulating a drawable static image sprite.
 * @author omgimanerd
 */

import { DrawingOptions, Sprite } from 'client/graphics/Sprite'

type Context = CanvasRenderingContext2D

export default class StaticSprite extends Sprite {
  image: HTMLImageElement

  constructor(image: HTMLImageElement) {
    super()
    this.image = image
  }

  static create(src: string): StaticSprite {
    const img = new Image()
    img.src = src
    return new StaticSprite(img)
  }

  get width() {
    return this.image.width
  }

  get height() {
    return this.image.height
  }

  getImage(frame: number | undefined): HTMLImageElement {
    if (frame !== undefined) {
      throw new Error('StaticSprite does not support a frame argument!')
    }
    return this.image
  }

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
        drawX,
        drawY,
        width,
        height,
      )
      // Reset the opacity only if we changed it.
      if (options.opacity) {
        context.globalAlpha = oldOpacity
      }
    })
  }
}
