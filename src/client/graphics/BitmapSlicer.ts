/**
 * Utility method for slicing a loaded image into ImageBitmaps.
 * @author
 */

/**
 * Slices an input image into an array of ImageBitmaps. The input image must
 * have a width divisible by its height, and will be sliced into (h/w) frames
 * ordered from left to right.
 *
 * @param image The input image to slice into an array of bitmaps.
 * @returns An array of frames sliced from the input image.
 */
const sliceImage = (image: HTMLImageElement): ImageBitmap[] => {
  const width = image.width
  const height = image.height
  if (width % height !== 0) {
    throw new Error(`Cannot slice image $${image.src} into bitmaps.`)
  }
  // Use an offscreen canvas to render the image for slicing, use this instead
  // of createImageBitmap() because we need fully synchronous code here.
  const canvas = new OffscreenCanvas(height, height)
  const context = canvas.getContext('2d')!
  const slices = []
  for (let offset = 0; offset < width; offset += width) {
    context.drawImage(image, offset, 0, height, height)
    slices.push(canvas.transferToImageBitmap())
  }
  return slices
}

export default sliceImage
