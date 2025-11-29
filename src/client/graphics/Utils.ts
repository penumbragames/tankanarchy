/**
 * @author omgimanerd
 */

/**
 * Helper function to execute the given callback in new canvas context.
 */
export const newCanvasState = (
  context: CanvasRenderingContext2D,
  callback: (ctx: CanvasRenderingContext2D) => void,
) => {
  context.save()
  callback(context)
  context.restore()
}
