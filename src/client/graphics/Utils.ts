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

/**
 * Slices an input image into an array of ImageBitmaps. The input image must
 * have a width divisible by its height, and will be sliced into (h/w) frames
 * ordered from left to right.
 *
 * @param image The input image to slice into an array of bitmaps.
 * @returns An array of frames sliced from the input image.
 */
export const sliceImage = async (
  image: HTMLImageElement,
): Promise<ImageBitmap[]> => {
  const width = image.width
  const height = image.height
  if (width % height !== 0) {
    throw new Error(`Cannot slice image ${image.src} into bitmaps.`)
  }
  const promises = []
  for (let offset = 0; offset < width; offset += height) {
    promises.push(createImageBitmap(image, offset, 0, height, height))
  }
  return Promise.all(promises)
}
