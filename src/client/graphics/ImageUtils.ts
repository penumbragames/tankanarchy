/**
 * Utility method for slicing a loaded image into ImageBitmaps.
 * @author
 */

/**
 * Asynchronously loads a given image into a HTMLImageElement.
 * @param src The path to the image source to load
 * @returns a Promise containing the HTMLImageElement with the loaded image.
 */
export const loadImage = async (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(error)
    // Set the image source to send the network request to load the image.
    img.src = src
  })
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
