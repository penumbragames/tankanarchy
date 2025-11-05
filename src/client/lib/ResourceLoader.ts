/**
 * @author omgimanerd
 */

interface Resource {
  src?: string | undefined
  // Fired by Image resource loading
  onload?: ((this: GlobalEventHandlers, event: Event) => any) | null
  // Fired by Audio resource loading
  oncanplaythrough?: ((this: GlobalEventHandlers, event: Event) => any) | null
  onerror?: ((event: ErrorEvent) => any) | null
}

/**
 * Loads a resource asynchronously, returning a Promise with the loaded
 * resource. Types need to have their relevant loaded state callback assigned
 * to the Promise resolution callback.
 *
 * @param resourceConstructor Object to be loaded asynchronously.
 * @param src The src string of the asset, which when set begins the async load.
 * @returns A promise containing the populated object
 */
export default async function loadResource<T extends Resource>(
  constructor: new () => T,
  src: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const resource: T = new constructor()
    const callback = () => resolve(resource)
    if (resource instanceof Image) {
      resource.onload = callback
    } else if (resource instanceof Audio) {
      resource.oncanplaythrough = callback
    }
    resource.onerror = (error) => reject(error)
    resource.src = src
  })
}
