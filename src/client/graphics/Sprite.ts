/**
 * Class encapsulating a drawable static image sprite.
 * @author omgimanerd
 */

type Context = CanvasRenderingContext2D

export class Sprite {
  image: HTMLImageElement

  constructor(image: HTMLImageElement) {
    this.image = image
  }

  static create(src: string): Sprite {
    const img = new Image()
    img.src = src
    return new Sprite(img)
  }

  get width() {
    return this.image.width
  }

  get height() {
    return this.image.height
  }

  /**
   * Context manager that runs the given callback in a new sub-context of a
   * canvas rendering context.
   * @param context {Context} The canvas context to save state
   *   for.
   * @param callback {() => void} The function to execute in the new drawing
   *   state.
   */
  newCanvasState(context: Context, callback: () => void) {
    context.save()
    callback()
    context.restore()
  }

  draw(context: Context) {
    context.drawImage(this.image, 0, 0)
  }

  drawCentered(context: Context) {
    context.drawImage(this.image, -this.width / 2, -this.height / 2)
  }

  drawAt(context: Context, x: number, y: number, angle: number = 0) {
    this.newCanvasState(context, () => {
      context.translate(x, y)
      context.rotate(angle)
      this.draw(context)
    })
  }

  drawCenteredAt(context: Context, x: number, y: number, angle: number = 0) {
    this.newCanvasState(context, () => {
      context.translate(x, y)
      context.rotate(angle)
      this.drawCentered(context)
    })
  }
}
